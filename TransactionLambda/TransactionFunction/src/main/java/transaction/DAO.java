package transaction;

import org.hibernate.Session;

public class DAO {
    public <T> T find(Session session, String id, Class<T> type) {
        return session.get(type, id);
    }

    public <T> void save(Session session, T object) {
        org.hibernate.Transaction transaction = session.beginTransaction();
        session.persist(object);
        transaction.commit();
    }

    public <T> void update(Session session, T object) {
        org.hibernate.Transaction transaction = session.beginTransaction();
        session.merge(object);
        transaction.commit();
    }

    public <T> void delete(Session session, T object) {
        org.hibernate.Transaction transaction = session.beginTransaction();
        session.remove(object);
        transaction.commit();
    }
}
