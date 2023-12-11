package transaction;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import java.util.List;

import java.util.UUID;

public class Service {
    private final SessionFactory sessionFactory;
    private final DAO DAO;

    public Service(SessionFactory sessionFactory, DAO DAO) {
        this.sessionFactory = sessionFactory;
        this.DAO = DAO;
    }

    public <T> List<T> read(Class<T> type) {
        try (Session session = sessionFactory.openSession()) {
            if (Transaction.class.isAssignableFrom(type)) {
                return session.createQuery("SELECT a FROM Transaction a", type).getResultList();
            } else {
                return session.createQuery("SELECT a FROM User a", type).getResultList();
            }
        } catch (Exception e) {
            throw new RuntimeException("in reading: " + e.getMessage());
        }
    }

    public <T> T read(String transactionID, Class<T> type) {
        try (Session session = sessionFactory.openSession()) {
            return DAO.find(session, transactionID, type);
        } catch (Exception e) {
            throw new RuntimeException("in finding: " + e.getMessage());
        }
    }

    public <T> String create(T object) {
        try (Session session = sessionFactory.openSession()) {
            if (object instanceof Transaction) {
                Transaction transaction = (Transaction) object;
                transaction.setId(UUID.randomUUID().toString());
                DAO.save(session, transaction);
                return transaction.getId();
            } else {
                User user = (User) object;
                DAO.save(session, user);
                return user.getEmail();
            }
        } catch (Exception e) {
            throw new RuntimeException("in creating: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public <T> T update(String id, T object) {
        try (Session session = sessionFactory.openSession()) {
            if (object instanceof Transaction) {
                Transaction transaction = (Transaction) object;

                // Retrieve entity from database
                Transaction oldTransaction = DAO.find(session, id, Transaction.class);

                // Checking data
                if (oldTransaction == null) {
                    throw new RuntimeException("No transaction with given ID");
                }
                if (!id.equalsIgnoreCase(oldTransaction.getId())) {
                    throw new RuntimeException(
                            String.format(
                                    "ID mismatch: calling with ID: %s, but given ID: %s",
                                    id,
                                    oldTransaction.getId()
                            )
                    );
                }

                // Update entity
                if (transaction.getDestination() != null) {
                    oldTransaction.setDestination(transaction.getDestination());
                }
                if (transaction.getNote() != null) {
                    oldTransaction.setNote(transaction.getNote());
                }
                oldTransaction.setValue(transaction.getValue());

                // Save updates to database
                DAO.update(session, oldTransaction);
                return (T) oldTransaction;
            }

            else {
                User user = (User) object;

                // Retrieve entity from database
                User oldUser = DAO.find(session, id, User.class);

                // Checking data
                if (oldUser == null) {
                    throw new RuntimeException("No user with given ID");
                }
                if (!id.equalsIgnoreCase(oldUser.getEmail())) {
                    throw new RuntimeException(
                            String.format(
                                    "ID mismatch: calling with ID: %s, but given ID: %s",
                                    id,
                                    oldUser.getEmail()
                            )
                    );
                }

                // Update entity
                if (user.getLastName() != null) {
                    oldUser.setLastName(user.getLastName());
                }
                if (user.getMiddleName() != null) {
                    oldUser.setMiddleName(user.getMiddleName());
                }
                if (user.getFirstName() != null) {
                    oldUser.setFirstName(user.getFirstName());
                }
                if (user.getPhone() != null) {
                    oldUser.setPhone(user.getPhone());
                }

                // Save updates to database
                DAO.update(session, oldUser);
                return (T) oldUser;
            }

        } catch (Exception e) {
            throw new RuntimeException("in updating: " + e.getMessage());
        }
    }

    public <T> boolean delete(String id, Class<T> type) {
        try (Session session = sessionFactory.openSession()) {
            // Retrieve entity from database
            T oldObject = DAO.find(session, id, type);
            if (oldObject == null) {
                throw new RuntimeException("No entity with given ID");
            }

            // Delete entity from database
            DAO.delete(session, oldObject);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("in deleting: " + e.getMessage());
        }
    }

}
