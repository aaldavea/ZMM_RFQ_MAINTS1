/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";
	return {
		init: function() {
			var fnGetJSONFromFile = function(sFileName) {
				var _oJSON = null;
				$.ajax({
					async: false,
					global: false,
					url: "../localService/notesService/mockdata/" + sFileName,
					dataType: "json",
					success: function(data) {
						_oJSON = data;
					}
				});
				return _oJSON;
			};
			// create
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/SGBT_NTE_CDS_API_D_SRV/"
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 100
			});

			// simulate
			var sPath = jQuery.sap.getModulePath("zgestion.petofer.localService.notesService");
			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath + "/mockdata",
				bGenerateMissingMockData: false,
				aEntitySetsNames: ["C_Sgbt_Nte_Cds_Apitp", "C_Sgbt_Nte_Cds_ApitpCreatedraft", "Sgbt_Nte_Cds_Langu", "Sgbt_Nte_Cds_Ntype",
					"Sgbt_Nte_Cds_NtypeT"
				]
			});

			var bFirstResponse = true;
			var aRequests = oMockServer.getRequests();

			aRequests.push({
				method: "GET",
				path: /.*Sgbt_Nte_Cds_Langu.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("Notes_Language.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*Sgbt_Nte_Cds_Ntype.*filter.*Name.*eq.*DETAILED_DESCRIPTION.*/,
				response: function(oXhr) {
					var oResults = true;
					if (bFirstResponse) {
						oResults = fnGetJSONFromFile("C_Sgbt_Nte_Cds_Ntype_first_response.json");
						bFirstResponse = false;
					} else {
						oResults = fnGetJSONFromFile("C_Sgbt_Nte_Cds_Ntype.json");
					}
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*Sgbt_Nte_Cds_Ntype.*filter.*Name.*eq.*RFQ_ITEM.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_Sgbt_Nte_Cds_Ntype_Item.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			// Create Draft for Notes 

			aRequests.push({
				method: "POST",
				path: /.*C_Sgbt_Nte_Cds_ApitpCreatedraft.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_Sgbt_Nte_Cds_ApitpCreatedraft.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			var firstResponse = true;

			aRequests.push({
				method: "GET",
				path: /.*C_Sgbt_Nte_Cds_Apitp.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_Sgbt_Nte_Cds_Apitp.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			oMockServer.setRequests(aRequests);
			oMockServer.start();
		}
	};
});