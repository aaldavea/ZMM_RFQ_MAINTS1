/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("zgestion.petofer.ext.util.formatter");
zgestion.petofer.ext.util.formatter = {
	returnObjectKey: function(r, d, R) {
		var o = "";
		if (r !== undefined && r !== null && r !== "" && typeof r === "string") {
			o = r;
			if (R !== undefined && R !== null && R !== "" && typeof R === "string") {
				o += R;
			}
		} else if (d !== undefined && d !== null && d !== "" && typeof d === "string") {
			o = d.replace(/[^a-zA-Z0-9]/g, "");
		}
		return o;
	},
	returnNotesRFQItemKey: function(r, R) {
		var o = "";
		if (r !== undefined && r !== "" && typeof r === "string") {
			o = r;
			if (R !== undefined && R !== "" && typeof R === "string") {
				o += R;
			}
		}
		return o;
	},
	returnNotesJSON: function(n) {
		var N = [];
		if (n && typeof n === "string") {
			var s = n.split(" ");
			for (var i = 0; i < s.length; i++) {
				var o = {};
				o.name = s[i];
				o.settings = {
					"languageList": {
						"showSecondaryValues": false
					}
				};
				N.push(o);
			}
		}
		return N;
	},
	isInternalAwarding: function(R) {
		if (R === "I") {
			return true;
		}
		return false;
	},
	isInternalProcessing: function(R) {
		if (R === "") {
			return true;
		}
		return false;
	},
	formatTableKey: function(D, C) {
		switch (D) {
			case "EKPO":
				return C.substr(C.length - 5);
			case "EKET":
				return C.substring(C.length - 9, C.length - 4) + "/" + C.substr(C.length - 3);
			case "EKPA":
				return C.substr(C.length - 5);
			default:
				return "";
		}
	},
	formatTableField: function(c, C) {
		if (!C) {
			return "";
		}
		return (c !== "") ? c : C;
	}
};