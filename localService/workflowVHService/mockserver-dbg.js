/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";

	return {
		init: function() {
			var fnGetFromFile = function(sFileName, sType) {
				var _oFile = null;
				$.ajax({
					async: false,
					global: false,
					url: "../localService/workflowVHService/mockdata/" + sFileName,
					dataType: sType,
					success: function(data) {
						_oFile = data;
					}
				});
				return _oFile;
			};

			// create
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/S_MMPURWorkflowVH_CDS/"
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 10
			});

			// simulate
			var sPath = jQuery.sap.getModulePath("zgestion.petofer.localService.workflowVHService");
			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath + "/mockdata",
				bGenerateMissingMockData: false,
				aEntitySetsNames: ["S_RFQWORKFLOWRECIPIENTVH"]
			});

			var aRequests = oMockServer.getRequests();

			aRequests.push({
				method: "GET",
				path: /.*S_RFQWORKFLOWRECIPIENTVH.*/,
				response: function(oXhr) {
					var oResults = fnGetFromFile("S_RFQWORKFLOWRECIPIENTVH.json", "json");
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