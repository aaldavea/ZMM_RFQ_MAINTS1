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
					url: "../localService/workflowService/mockdata/" + sFileName,
					dataType: sType,
					success: function(data) {
						_oFile = data;
					}
				});
				return _oFile;
			};

			// create
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/SWF_FLEX_DEF_SRV/"
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 10
			});

			// simulate
			var sPath = jQuery.sap.getModulePath("zgestion.petofer.localService.workflowService");
			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath + "/mockdata",
				bGenerateMissingMockData: false,
				aEntitySetsNames: ["WorkflowTemplates"]
			});

			var aRequests = oMockServer.getRequests();

			// aRequests.push({
			// 	method: "GET",
			// 	path: /.*GetApplicationWorkflowInstances.,
			// 	response: function(oXhr) {
			// 		var oResults = fnGetFromFile("GetApplicationWorkflowInstance.xml", "xml");
			// 		oXhr.respond(0, {
			// 			"Content-Type": "application/xml;charset=utf-8"
			// 		}, new XMLSerializer().serializeToString(oResults));
			// 		return oResults;
			// 	}
			// });

			aRequests.push({
				method: "GET",
				path: /.*GetApplicationWorkflowInstances.*/,
				response: function(oXhr) {
					var oResults = fnGetFromFile("GetApplicationWorkflowInstance.json", "json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*SimulateApplicationWorkflowInstances.*/,
				response: function(oXhr) {
					var oResults = fnGetFromFile("GetApplicationWorkflowInstance.json", "json");
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