package user;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import java.util.List;

public class UserService {
    private final SessionFactory sessionFactory;
    private final UserDAO userDAO;
    public UserService(SessionFactory sessionFactory, UserDAO userDAO) {
        this.sessionFactory = sessionFactory;
        this.userDAO = userDAO;
    }

    public List<User> view() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("SELECT a FROM User a", User.class).getResultList();
        }
    }

    public User view(String userEmail) {
        try (Session session = sessionFactory.openSession()) {
            return userDAO.find(session, userEmail);
        }
    }

    public boolean check(String userEmail) {
        try (Session session = sessionFactory.openSession()) {
            return userDAO.find(session, userEmail) != null;
        }
    }

    public String createUser(User user) {
        try (Session session = sessionFactory.openSession()) {
            userDAO.save(session, user);
            return user.getEmail();
        }
    }
}
