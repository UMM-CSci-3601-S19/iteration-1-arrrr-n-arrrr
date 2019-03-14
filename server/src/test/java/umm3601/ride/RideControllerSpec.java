package umm3601.ride;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

public class RideControllerSpec {
  private RideController rideController;
  private ObjectId NorthPoleId;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> rideDocuments = db.getCollection("rides");
    rideDocuments.drop();
    List<Document> testRides = new ArrayList<>();
    testRides.add(Document.parse("{\n" +
      "                    destination: \"North Pole\",\n" +
      "                    origin: \"South Pole\",\n" +
      "                    notes: \"I will pay for gas!!?\",\n" +
      "                    driving: false\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    destination: \"Brazil\",\n" +
      "                    origin: \"Canada\",\n" +
      "                    notes: \"I will not pay for gas.\",\n" +
      "                    driving: true\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    destination: \"China\",\n" +
      "                    origin: \"Japan\",\n" +
      "                    notes: \"Hope you have a flying car.\",\n" +
      "                    driving: false\n" +
      "                }"));

    NorthPoleId = new ObjectId();
    BasicDBObject NorthPole = new BasicDBObject("_id", NorthPoleId);
    NorthPole = NorthPole.append("destination", "North Pole")
      .append("origin", "South Pole")
      .append("notes", "I will pay for gas!!?")
      .append("driving", false);


    rideDocuments.insertMany(testRides);
    rideDocuments.insertOne(Document.parse(NorthPole.toJson()));

    // It might be important to construct this _after_ the DB is set up
    // in case there are bits in the constructor that care about the state
    // of the database.
    rideController = new RideController(db);
  }

  // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
  private BsonArray parseJsonArray(String json) {
    final CodecRegistry codecRegistry
      = CodecRegistries.fromProviders(Arrays.asList(
      new ValueCodecProvider(),
      new BsonValueCodecProvider(),
      new DocumentCodecProvider()));

    JsonReader reader = new JsonReader(json);
    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

    return arrayReader.decode(reader, DecoderContext.builder().build());
  }

  private static String getDestination(BsonValue val) {
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get("destination")).getValue();
  }

  private static String getOrigin(BsonValue val) {
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get("origin")).getValue();
  }

  @Test
  public void getAllRides() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = rideController.getRides(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 4 rides", 4, docs.size());
    List<String> destinations = docs
      .stream()
      .map(RideControllerSpec::getDestination)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDestinations = Arrays.asList("North Pole", "Brazil", "China", "North Pole");
    assertEquals("Names should match", expectedDestinations, destinations);
  }

  @Test
  public void getRidesFromJapan() {
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("origin", new String[]{"Japan"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 1 rides", 1, docs.size());
    List<String> destinations = docs
      .stream()
      .map(RideControllerSpec::getDestination)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDestinations = Arrays.asList("China");
    assertEquals("Desinations should match", expectedDestinations, destinations);
  }

  @Test
  public void getNorthPoleById() {
    String jsonResult = rideController.getRide(NorthPoleId.toHexString());
    Document NorthPole = Document.parse(jsonResult);
    assertEquals("Destination should match", "North Pole", NorthPole.get("destination"));
    String noJsonResult = rideController.getRide(new ObjectId().toString());
    assertNull("No name should match", noJsonResult);
  }

  @Test
  public void addRideTest() {
    String newId = rideController.addNewRide("Brazil", "China", "I hope you have a flying car", false);

    assertNotNull("Add new ride should return true when ride is added,", newId);
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("destination", new String[]{"Brazil"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    List<String> destination = docs
      .stream()
      .map(RideControllerSpec::getDestination)
      .sorted()
      .collect(Collectors.toList());
    assertEquals("Should return destination of new ride", "Brazil", destination.get(0));
  }

  @Test
  public void getRidesByDestination() {
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("destination", new String[]{"[C,Z]"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should be 2 rides", 2, docs.size());
    List<String> destination = docs
      .stream()
      .map(RideControllerSpec::getDestination)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedDestination = Arrays.asList("Brazil","China");
    assertEquals("Destinations should match", expectedDestination, destination);

  }

  @Test
  public void getRidesByOrigin() {
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("origin", new String[]{"[C,J]"});
    String jsonResult = rideController.getRides(argMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should be 2 rides", 2, docs.size());
    List<String> origin = docs
      .stream()
      .map(RideControllerSpec::getOrigin)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedOrigin = Arrays.asList("Cananda","Japan");
    assertEquals("Origins should match", expectedOrigin, origin);

  }


}
