package models.lesson

import java.util.Locale

import plm.core.model.lesson.tip.AbstractTipFactory

class TipFactory extends AbstractTipFactory {

  override def getDefaultTipReplacement(humanLanguage: Locale): String = {
		"<tips data-tipid=\"$1\" data-title=\"" + getDefaultLabel(humanLanguage) + "\">$2</tips>"
	}

	override def getTipWithLabelReplacement(): String = {
	  "<tips data-tipid=\"$1\" data-title=\"$2\">$3</tips>"
	}
}