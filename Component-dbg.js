/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("zgestion.petofer.Component");
sap.ui.getCore().loadLibrary("sap.ui.generic.app");
jQuery.sap.require("sap.ui.generic.app.AppComponent");
jQuery.sap.require("zgestion.petofer.ext.util.formatter");

sap.ui.generic.app.AppComponent.extend("zgestion.petofer.Component", {
	metadata: {
		"manifest": "json"
	}
});