/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";
	return {
		init: function() {
			// create
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/SGBT_NTE_CDS_API_SRV/"
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 100
			});

			// simulate
			var sPath = jQuery.sap.getModulePath("zgestion.petofer.localService.notesNoDraftService");
			oMockServer.simulate(sPath + "/metadata.xml", {
				//sMockdataBaseUrl: sPath + "/mockdata",
				bGenerateMissingMockData: false,
				aEntitySetsNames: ["C_Sgbt_Nte_Cds_Apitp"]
			});
			
			oMockServer.start();
		}
	};
});