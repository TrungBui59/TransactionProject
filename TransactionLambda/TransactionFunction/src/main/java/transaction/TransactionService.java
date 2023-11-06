package transaction;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import java.util.List;

import java.util.UUID;

public class TransactionService {
    private final SessionFactory sessionFactory;
    private final TransactionDAO transactionDAO;
    public TransactionService(SessionFactory sessionFactory, TransactionDAO transactionDAO) {
        this.sessionFactory = sessionFactory;
        this.transactionDAO = transactionDAO;
    }

    public List<Transaction> view() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("SELECT a FROM Transaction a", Transaction.class).getResultList();
        }
    }

    public Transaction view(String transactionID) {
        try (Session session = sessionFactory.openSession()) {
            return (Transaction) transactionDAO.find(session, transactionID)
                    .orElseGet(Transaction::new);
        }
    }

    public String createTransaction(Transaction transaction) {
        try (Session session = sessionFactory.openSession()) {
            transaction.setId(UUID.randomUUID().toString());
            transactionDAO.save(session, transaction);
            return transaction.getId();
        }
    }
}
