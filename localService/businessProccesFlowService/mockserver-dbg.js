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
					url: "../localService/businessProccesFlowService/mockdata/" + sFileName,
					dataType: "json",
					success: function(data) {
						_oJSON = data;
					}
				});
				return _oJSON;
			};

			// create
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/SAP/CA_BPF_LAYOUT_METADATA_SRV/"
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 100
			});

			// simulate
			var sPath = jQuery.sap.getModulePath("zgestion.petofer.localService.businessProccesFlowService");
			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath + "/mockdata",
				bGenerateMissingMockData: false,
				aEntitySetsNames: ["C_LaneLayout", "C_RFQProcessFlow", "C_NodeLayout", "I_RequestForQuotation"]
			});

			var aRequests = oMockServer.getRequests();

			aRequests.push({
				method: "GET",
				path: /.*C_LaneLayout.*filter.*ProcessFlowLayout.*eq.*C_RFQProcessFlow.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_LaneLayout.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RFQProcessFlow.*filter.*RequestForQuotation.*eq.*7000002791.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RFQProcessFlow_7000002791.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RFQProcessFlow.*filter.*RequestForQuotation.*eq.*7000002790.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RFQProcessFlow_7000002790.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RFQProcessFlow.*filter.*RequestForQuotation.{0,4}eq(%|2|7|0){0,10}/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RFQProcessFlow.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.C_NodeLayout.*filter.*ProcessFlowLayout.*eq.*C_RFQProcessFlow.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_NodeLayout.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*I_RequestForQuotation.*RequestForQuotation.*7000002791.*select.*RFQLifecycleStatus.*CreationDate.*QuotationLatestSubmissionDate.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("I_RequestForQuotation_7000002791.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*I_RequestForQuotation.*RequestForQuotation.*7000002790.*select.*RFQLifecycleStatus.*CreationDate.*QuotationLatestSubmissionDate.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("I_RequestForQuotation_7000002790.json");
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