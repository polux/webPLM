package json.operation

import play.api.libs.json.JsValue
import play.api.libs.json.JsObject
import play.api.libs.json.Json
import json.Utils
import plm.universe.turtles.operations._

/**
 * @author matthieu
 */
object TurtleOperationToJson {
  def turtleOperationWrite(turtleOperation: TurtleOperation): JsValue = {
    var json: JsObject = null
   turtleOperation match {
      case moveTurtle: MoveTurtle =>
        json = moveTurtleWrite(moveTurtle)
      case addLine: AddLine =>
        json = addLineWrite(addLine)
      case addCircle: AddCircle =>
        json = addCircleWrite(addCircle)
      case _ =>
        json = Json.obj()
    }
    json = json ++ Json.obj(
      "turtleID" -> turtleOperation.getTurtle.getName
    )
    return json
  }
  
  def moveTurtleWrite(moveTurtle: MoveTurtle): JsObject = {
    Json.obj(
      "oldX" -> moveTurtle.getOldX,
      "oldY" -> moveTurtle.getOldY,
      "newX" -> moveTurtle.getNewX,
      "newY" -> moveTurtle.getNewY
    )
  }
  
  def addLineWrite(addLine: AddLine): JsObject = {
    Json.obj(
      "x1" -> addLine.getX1,
      "y1" -> addLine.getY1,
      "x2" -> addLine.getX2,
      "y2" -> addLine.getY2,
      "color" -> Utils.colorToWrapper(addLine.getColor)
    )
  }
  
  def addCircleWrite(addCircle: AddCircle): JsObject = {
    Json.obj(
      "x" -> addCircle.getX,
      "y" -> addCircle.getY,
      "radius" -> addCircle.getRadius,
      "color" -> Utils.colorToWrapper(addCircle.getColor)
    )
  }
}