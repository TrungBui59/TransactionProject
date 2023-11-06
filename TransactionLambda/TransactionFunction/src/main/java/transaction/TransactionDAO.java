package transaction;

import org.hibernate.Session;

import java.util.Optional;

public class TransactionDAO {
    public Optional<Object> find(Session session, String transactionID) {
        return Optional.ofNullable(session.get(Transaction.class, transactionID));
    }

    public void save(Session session, Transaction moneyTransaction) {
        org.hibernate.Transaction transaction = session.beginTransaction();
        session.persist(moneyTransaction);
        transaction.commit();
    }
}
