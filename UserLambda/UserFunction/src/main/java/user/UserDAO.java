package user;

import org.hibernate.Session;

public class UserDAO {
    public User find(Session session, String userEmail) {
        return session.get(User.class, userEmail);
    }

    public void save(Session session, User user) {
        org.hibernate.Transaction transaction = session.beginTransaction();
        session.persist(user);
        transaction.commit();
    }
}
