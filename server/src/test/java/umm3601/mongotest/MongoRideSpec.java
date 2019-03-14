package umm3601.mongotest;

import com.mongodb.MongoClient;
import com.mongodb.client.*;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;
import static org.junit.Assert.*;

public class MongoRideSpec {

  private MongoCollection<Document> rideDocuments;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    rideDocuments = db.getCollection("rides");
    rideDocuments.drop();
    List<Document> testRides = new ArrayList<>();
    testRides.add(Document.parse("{\n" +
      "                    destination: \"North Pole\",\n" +
      "                    origin: \"South Pole\",\n" +
      "                    notes: \"I will pay for gas??!\",\n" +
      "                    driving: false\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    destination: \"China\",\n" +
      "                    origin: \"Japan\",\n" +
      "                    notes: \"Here are some notes\",\n" +
      "                    driving: true\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    destination: \"Mars\",\n" +
      "                    origin: \"Earth\",\n" +
      "                    notes: \"I hope you have friend at NASA\",\n" +
      "                    driving: false\n" +
      "                }"));
    rideDocuments.insertMany(testRides);
  }

  private List<Document> intoList(MongoIterable<Document> documents) {
    List<Document> rides = new ArrayList<>();
    documents.into(rides);
    return rides;
  }

  private int countRides(FindIterable<Document> documents) {
    List<Document> rides = intoList(documents);
    return rides.size();
  }

  @Test
  public void shouldBeThreeRides() {
    FindIterable<Document> documents = rideDocuments.find();
    int numberOfRides = countRides(documents);
    assertEquals("Should be 3 total rides", 3, numberOfRides);
  }

  @Test
  public void shouldBeOneToNorthPole() {
    FindIterable<Document> documents = rideDocuments.find(eq("destination", "North Pole"));
    int numberOfRides = countRides(documents);
    assertEquals("Should be 1 ride to North pople", 1, numberOfRides);
  }

  @Test
  public void shouldBeOneFromEarth() {
    FindIterable<Document> documents = rideDocuments.find(gt("origin", "Earth"));
    int numberOfRides = countRides(documents);
    assertEquals("Should be 1 from Earth", 1, numberOfRides);
  }

  @Test
  public void drvingFalseSortedByDestination() {
    FindIterable<Document> documents
      = rideDocuments.find(eq("driving", false))
      .sort(Sorts.ascending("destination"));
    List<Document> docs = intoList(documents);
    assertEquals("Should be 2", 2, docs.size());
    assertEquals("First should be to Mars", "Mars", docs.get(0).get("destination"));
    assertEquals("Second should be to North Pole", "North Pole", docs.get(1).get("destination"));
  }

  @Test
  public void drivingFalseAndOriginEarth() {
    FindIterable<Document> documents
      = rideDocuments.find(and(eq("driving", false),
      eq("origin", "Earth")));
    List<Document> docs = intoList(documents);
    assertEquals("Should be 1", 1, docs.size());
    assertEquals("First should be to Mars", "Mars", docs.get(0).get("destination"));
  }

  @Test
  public void justDestinationAndOrigin() {
    FindIterable<Document> documents
      = rideDocuments.find().projection(fields(include("destination", "origin")));
    List<Document> docs = intoList(documents);
    assertEquals("Should be 3", 3, docs.size());
    assertEquals("First should be to North Pole", "North Pole", docs.get(0).get("destination"));
    assertNotNull("First should have origin", docs.get(0).get("origin"));
    assertNull("First shouldn't have 'notes'", docs.get(0).get("notes"));
    assertNull("First shouldn't have 'driving' ", docs.get(0).get("driving"));
    assertNotNull("First should have '_id'", docs.get(0).get("_id"));
  }

  @Test
  public void justDestinationAndOriginNoId() {
    FindIterable<Document> documents
      = rideDocuments.find()
      .projection(fields(include("destination", "origin"), excludeId()));
    List<Document> docs = intoList(documents);
    assertEquals("Should be 3", 3, docs.size());
    assertEquals("First should be to North Pole", "North Pole", docs.get(0).get("destination"));
    assertNotNull("First should have origin", docs.get(0).get("origin"));
    assertNull("First shouldn't have 'notes'", docs.get(0).get("notes"));
    assertNull("First shouldn't have 'driving'", docs.get(0).get("driving"));
    assertNull("First should not have '_id'", docs.get(0).get("_id"));
  }

  @Test
  public void justDestinationAndNotesNoIdSortedByOrigin() {
    FindIterable<Document> documents
      = rideDocuments.find()
      .sort(Sorts.ascending("origin"))
      .projection(fields(include("destination", "notes"), excludeId()));
    List<Document> docs = intoList(documents);
    assertEquals("Should be 3", 3, docs.size());
    assertEquals("First should be from Earth", "Earth", docs.get(0).get("origin"));
    assertNotNull("First should have destination", docs.get(0).get("destination"));
    assertNull("First shouldn't have 'driving'", docs.get(0).get("driving"));
    assertNull("First shouldn't have 'origin'", docs.get(0).get("origin"));
    assertNull("First should not have '_id'", docs.get(0).get("_id"));
  }

}
