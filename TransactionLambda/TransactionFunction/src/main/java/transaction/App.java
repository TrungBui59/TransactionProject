package transaction;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.SessionFactory;
import org.hibernate.boot.Metadata;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.service.ServiceRegistry;

import java.util.HashMap;
import java.util.Map;

/**
 * Handler for requests to Lambda function.
 */
public class App implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final SessionFactory sessionFactory = createSessionFactory();
    private static SessionFactory createSessionFactory() {
        try {
            // Configurations
            Map<String, Object> settings = new HashMap<>();
            settings.put("hibernate.connection.driver_class", "com.mysql.cj.jdbc.Driver");
            settings.put("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
            settings.put("hibernate.connection.url", System.getenv("DB_URL"));
            settings.put("hibernate.connection.username", System.getenv("DB_USER"));
            settings.put("hibernate.connection.password", System.getenv("DB_PASS"));
            settings.put("hibernate.current_session_context_class", "thread");
            settings.put("hibernate.show_sql", "true");
            settings.put("hibernate.format_sql", "true");

            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                    .applySettings(settings).build();

            MetadataSources metadataSources = new MetadataSources(serviceRegistry);
            metadataSources.addAnnotatedClass(Transaction.class);
            metadataSources.addAnnotatedClass(User.class);
            Metadata metadata = metadataSources.buildMetadata();

            return metadata.getSessionFactoryBuilder().build();
        } catch (Exception e) {
            return null;
        }
    }
    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent()
                .withHeaders(headers);

        Map<String, Object> body = new HashMap<>();
        body.put("Response", "");
        try {
            Service service = new Service(sessionFactory, new DAO());

            boolean isPeople = false;
            Class<?> targetType;
            switch (input.getResource()) {
                case "/people":
                    isPeople = true;

                case "/transaction":
                    targetType = (isPeople ? User.class : Transaction.class).asSubclass(Object.class);

                    // Create a new transaction
                    if (input.getHttpMethod().equalsIgnoreCase("POST")) {
                        body.replace(
                                "Response",
                                service.create(fromJson(input.getBody(), targetType))
                        );
                    }

                    // Read all transactions
                    else if (input.getHttpMethod().equalsIgnoreCase("GET")) {
                        body.replace(
                                "Response",
                                service.read(targetType)
                        );
                    }

                    // Unknown method
                    else {
                        throw new RuntimeException("in parsing request: Unknown HTTP Method: " + input.getHttpMethod());
                    }

                    break;

                case "/people/{id}":
                    isPeople = true;
                case "/transaction/{id}":
                    targetType = (isPeople ? User.class : Transaction.class).asSubclass(Object.class);

                    // Read a transaction
                    if (input.getHttpMethod().equalsIgnoreCase("GET")) {
                        body.replace(
                                "Response",
                                service.read(input.getPathParameters().get("id"), targetType)
                        );
                    }

                    // Update a transaction
                    else if (input.getHttpMethod().equalsIgnoreCase("PUT")) {
                        body.replace(
                                "Response",
                                service.update(
                                        input.getPathParameters().get("id"),
                                        fromJson(input.getBody(), targetType)
                                )
                        );
                    }

                    // Delete a transaction
                    else if (input.getHttpMethod().equalsIgnoreCase("DELETE")) {
                        body.replace(
                                "Response",
                                service.delete(input.getPathParameters().get("id"), targetType)
                        );
                    }

                    // Unknown method
                    else {
                        throw new RuntimeException("in parsing request: Unknown HTTP Method: " + input.getHttpMethod());
                    }

                    break;

                default:
                    throw new RuntimeException("in parsing request: Unknown Resource: " + input.getResource());
            }

            return response
                    .withBody(toJson(body))
                    .withStatusCode(200);

        } catch (Exception e) {
            body.replace("Response", "ERROR " + e.getMessage());
            return response
                    .withBody(toJson(body))
                    .withStatusCode(500);
        }
    }

    private static <T> String toJson(T object) {
        try {
            return OBJECT_MAPPER.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private static <T> T fromJson(String json, Class<T> type) {
        try {
            return OBJECT_MAPPER.readValue(json, type);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
