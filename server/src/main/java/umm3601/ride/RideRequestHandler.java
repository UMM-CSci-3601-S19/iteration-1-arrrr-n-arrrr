package umm3601.ride;

import org.bson.Document;
import spark.Request;
import spark.Response;


public class RideRequestHandler {

  private final RideController rideController;

  public RideRequestHandler(RideController rideController) {
    this.rideController = rideController;
  }

  /**
   * Method called from Server when the 'api/users/:id' endpoint is received.
   * Get a JSON response with a list of all the users in the database.
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return one user in JSON formatted string and if it fails it will return text with a different HTTP status code
   */
  public String getRideJSON(Request req, Response res) {
    res.type("application/json");
    String id = req.params("id");
    String ride;
    try {
      ride = rideController.getRide(id);
    } catch (IllegalArgumentException e) {
      // This is thrown if the ID doesn't have the appropriate
      // form for a Mongo Object ID.
      // https://docs.mongodb.com/manual/reference/method/ObjectId/
      res.status(400);
      res.body("The requested ride id " + id + " wasn't a legal Mongo Object ID.\n" +
        "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
      return "";
    }
    if (ride != null) {
      return ride;
    } else {
      res.status(404);
      res.body("The requested ride with id " + id + " was not found");
      return "";
    }
  }


  /**
   * Method called from Server when the 'api/users' endpoint is received.
   * This handles the request received and the response
   * that will be sent back.
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return an array of users in JSON formatted String
   */
  public String getRides(Request req, Response res) {
    res.type("application/json");
    return rideController.getRides(req.queryMap().toMap());
  }


  /**
   * Method called from Server when the 'api/users/new' endpoint is received.
   * Gets specified user info from request and calls addNewUser helper method
   * to append that info to a document
   *
   * @param req the HTTP request
   * @param res the HTTP response
   * @return a boolean as whether the user was added successfully or not
   */
  public String addNewRide(Request req, Response res) {
    res.type("application/json");

    Document newRide = Document.parse(req.body());

    System.out.println(newRide);

    String destination = newRide.getString("destination");
    String origin = newRide.getString("origin");
    String notes = newRide.getString("notes");
    Boolean driving = newRide.getBoolean("driving");

    System.err.println("Adding new ride [destination=" + destination + ", origin=" + origin +
      " notes=" + notes + " driving=" + driving + ']');
    return rideController.addNewRide(destination, origin, notes, driving);
  }
}
