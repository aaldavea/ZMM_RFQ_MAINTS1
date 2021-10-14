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
					url: "../localService/eshService/mockdata/" + sFileName,
					dataType: "json",
					success: function(data) {
						_oJSON = data;
					}
				});
				return _oJSON;
			};

			// create
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/ESH_SEARCH_SRV/"
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 10
			});

			// simulate
			var sPath = jQuery.sap.getModulePath("zgestion.petofer.localService.eshService");
			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath + "/mockdata",
				bGenerateMissingMockData: false,
				aEntitySetsNames: ["ServerInfos"]
			});

			var aRequests = oMockServer.getRequests();

			aRequests.push({
				method: "GET",
				path: /.*ServerInfos.*expand.*Services.*Capabilities.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("Capabilities.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*DataSources.*expand.*Attributes.*UIAreas.*filter.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("DataSources.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*InteractionEventLists.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("InteractionEventLists.json");
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