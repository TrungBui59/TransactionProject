package transaction;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Transactions")
public class Transaction {
    @Id
    @Column(name = "id")
    private String id;
    @Column(name = "value")
    private double value;
    @Column(name = "note")
    private String note;
    @Column(name = "destination")
    private String destination;

    public Transaction() {
        this.id = null;
        this.value = 0;
        this.note = null;
        this.destination = null;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }
}
