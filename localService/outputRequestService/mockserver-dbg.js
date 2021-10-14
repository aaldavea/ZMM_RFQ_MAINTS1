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
					url: "../localService/outputRequestService/mockdata/" + sFileName,
					dataType: "json",
					success: function(data) {
						_oJSON = data;
					}
				});
				return _oJSON;
			};

			// create
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/CA_OC_OUTPUT_REQUEST_SRV/"
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 10
			});

			// simulate
			var sPath = jQuery.sap.getModulePath("zgestion.petofer.localService.outputRequestService");
			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath + "/mockdata",
				bGenerateMissingMockData: false,
				aEntitySetsNames: ["Roots", "VL_FV_APOC_OR_DISPATCH_TIME", "VL_FV_APOC_OR_OUTPUT_STATUS", "VL_SH_H_T002"]
			});

			var aRequests = oMockServer.getRequests();

			aRequests.push({
				method: "GET",
				path: /.*Roots.*ApplObjectType.*REQUEST_FOR_QUOTATION.*ApplObjectId.*Items.*count.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("Roots_count.txt");
					oXhr.respond(0, {
						"Content-Type": "text/plain;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*Roots.*ApplObjectType.*REQUEST_FOR_QUOTATION.*ApplObjectId.{0,4}0.*Items.*skip.*0.*top.*20.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("Roots_0.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*Roots.*ApplObjectType.*REQUEST_FOR_QUOTATION.*ApplObjectId.{0,4}7000002790.*Items.*skip.*0.*top.*20.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("Roots_7000002790.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*Roots.*ApplObjectType.*REQUEST_FOR_QUOTATION.*ApplObjectId.{0,4}7000002791.*Items.*skip.*0.*top.*20.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("Roots_7000002791.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});
			
			aRequests.push({
				method: "GET",
				path: /.*Roots.*ApplObjectType.*REQUEST_FOR_QUOTATION.*ApplObjectId.{0,4}0.{0,3}/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("Roots_new_0.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});
			
			aRequests.push({
				method: "GET",
				path: /.*Roots.*ApplObjectType.*REQUEST_FOR_QUOTATION.*ApplObjectId.{0,4}7000002790.{0,3}/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("Roots_new_7000002790.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});
			
						aRequests.push({
				method: "GET",
				path: /.*Roots.*ApplObjectType.*REQUEST_FOR_QUOTATION.*ApplObjectId.{0,4}7000002791.{0,3}/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("Roots_new_7000002791.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*VL_FV_APOC_OR_OUTPUT_STATUS.*count.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("VL_FV_APOC_OR_OUTPUT_STATUS_count.txt");
					oXhr.respond(0, {
						"Content-Type": "text/plain;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*VL_FV_APOC_OR_OUTPUT_STATUS.*skip.*0.*top.*100.*orderby.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("VL_FV_APOC_OR_OUTPUT_STATUS.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*VL_FV_APOC_OR_DISPATCH_TIME.*count.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("VL_FV_APOC_OR_DISPATCH_TIME_count.txt");
					oXhr.respond(0, {
						"Content-Type": "text/plain;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*VL_FV_APOC_OR_DISPATCH_TIME.*skip.*0.*top.*100.*orderby.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("VL_FV_APOC_OR_DISPATCH_TIME.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*VL_SH_H_T002.*count.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("VL_SH_H_T002_count.txt");
					oXhr.respond(0, {
						"Content-Type": "text/plain;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*VL_SH_H_T002.*skip.*0.*top.*100.*orderby.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("VL_SH_H_T002.json");
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