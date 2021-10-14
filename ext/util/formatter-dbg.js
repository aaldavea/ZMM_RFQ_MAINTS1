/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("zgestion.petofer.ext.util.formatter");

zgestion.petofer.ext.util.formatter = {

	returnObjectKey: function (sRequestForQuotation, sDraftUUID, sRequestForQuotationItem) {
		var objectKey = "";
		if (sRequestForQuotation !== undefined && sRequestForQuotation !== null && sRequestForQuotation !== "" && typeof sRequestForQuotation ===
			"string") {
			objectKey = sRequestForQuotation;
			if (sRequestForQuotationItem !== undefined && sRequestForQuotationItem !== null && sRequestForQuotationItem !== "" && typeof sRequestForQuotationItem ===
				"string") {
				objectKey += sRequestForQuotationItem;
			}
		} else if (sDraftUUID !== undefined && sDraftUUID !== null && sDraftUUID !== "" && typeof sDraftUUID === "string") {
			objectKey = sDraftUUID.replace(/[^a-zA-Z0-9]/g, "");
		}
		return objectKey;
	},

	returnNotesRFQItemKey: function (sRequestForQuotation, sRequestForQuotationItem) {
		var objectKey = "";
		if (sRequestForQuotation !== undefined && sRequestForQuotation !== "" && typeof sRequestForQuotation ===
			"string") {
			objectKey = sRequestForQuotation;
			if (sRequestForQuotationItem !== undefined && sRequestForQuotationItem !== "" && typeof sRequestForQuotationItem ===
				"string") {
				objectKey += sRequestForQuotationItem;
			}
		}
		return objectKey;
	},

	returnNotesJSON: function (sNotesType) {
		var aNoteTypes = [];
		if (sNotesType && typeof sNotesType === "string") {
			var aSplitString = sNotesType.split(" ");
			for (var i = 0; i < aSplitString.length; i++) {
				var oNoteTypes = {};
				oNoteTypes.name = aSplitString[i];
				oNoteTypes.settings = {
					"languageList": {
						"showSecondaryValues": false
					}
				};
				aNoteTypes.push(oNoteTypes);
			}
		}
		return aNoteTypes;
	},

	isInternalAwarding: function (RFQAwardingType) {
		if (RFQAwardingType === "I") {
			return true;
		}
		return false;
	},

	isInternalProcessing: function (RFQExternalProcessingType) {
		if (RFQExternalProcessingType === "") {
			return true;
		}
		return false;
	},

	formatTableKey: function (DatabaseTable, ChangeDocTableKey) {
		switch (DatabaseTable) {
		case "EKPO":
			return ChangeDocTableKey.substr(ChangeDocTableKey.length - 5);
		case "EKET":
			return ChangeDocTableKey.substring(ChangeDocTableKey.length - 9, ChangeDocTableKey.length - 4) + "/" + ChangeDocTableKey.substr(
				ChangeDocTableKey.length - 3);
		case "EKPA":
			return ChangeDocTableKey.substr(ChangeDocTableKey.length - 5);
		default:
			return "";
		}
	},

	formatTableField: function (sChangeDocDatabaseTableFieldText, sChangeDocDatabaseTableField) {
		if (!sChangeDocDatabaseTableField) {
			return "";
		}
		return (sChangeDocDatabaseTableFieldText !== "") ? sChangeDocDatabaseTableFieldText : sChangeDocDatabaseTableField;
	}

};