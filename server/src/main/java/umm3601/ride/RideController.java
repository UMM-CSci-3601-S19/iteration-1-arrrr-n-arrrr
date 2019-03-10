package umm3601.ride;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;

public class RideController {

  private final MongoCollection<Document> rideCollection;


  public RideController(MongoDatabase database) {
    rideCollection = database.getCollection("rides");
  }


  public String getRide(String id) {
    FindIterable<Document> jsonRides
      = rideCollection
      .find(eq("_id", new ObjectId(id)));

    Iterator<Document> iterator = jsonRides.iterator();
    if (iterator.hasNext()) {
      Document ride = iterator.next();
      return ride.toJson();
    } else {
      // We didn't find the desired ride
      return null;
    }
  }


  public String getRides(Map<String, String[]> queryParams) {

    Document filterDoc = new Document();

    if (queryParams.containsKey("destination")) {
      String targetDestination = (queryParams.get("destination")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetDestination);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("destination", contentRegQuery);
    }

    if (queryParams.containsKey("origin")) {
      String targetOrigin = (queryParams.get("origin")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetOrigin);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("origin", contentRegQuery);
    }

    if (queryParams.containsKey("notes")) {
      String targetNotes = (queryParams.get("notes")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetNotes);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("notes", contentRegQuery);
    }

    if (queryParams.containsKey("driving")) {
      String targetDriving = (queryParams.get("driving")[0]);
      boolean targetDrivingBool;
      if (targetDriving.equals("true")) {
        targetDrivingBool = true;
      } else {
        targetDrivingBool = false;
      }

      filterDoc = filterDoc.append("driving", targetDrivingBool);
    }

    //FindIterable comes from mongo, Document comes from Gson
    FindIterable<Document> matchingRides = rideCollection.find(filterDoc);

    return serializeIterable(matchingRides);
  }

  /*
   * Take an iterable collection of documents, turn each into JSON string
   * using `document.toJson`, and then join those strings into a single
   * string representing an array of JSON objects.
   */
  private String serializeIterable(Iterable<Document> documents) {
    return StreamSupport.stream(documents.spliterator(), false)
      .map(Document::toJson)
      .collect(Collectors.joining(", ", "[", "]"));
  }



  public String addNewRide(String destination, String origin, String notes, String driving) {

    Document newRide = new Document();
    newRide.append("destination", destination);
    newRide.append("origin", origin);
    newRide.append("notes", notes);
    newRide.append("driving", driving);

    try {
      rideCollection.insertOne(newRide);
      ObjectId id = newRide.getObjectId("_id");
      System.err.println("Successfully added new ride [destination=" + destination +
        ", origin= " + origin + ", notes=" + notes + " driving= " + driving + ']');
      return id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }
}
