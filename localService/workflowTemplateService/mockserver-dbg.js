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
					url: "../localService/workflowTemplateService/mockdata/" + sFileName,
					dataType: sType,
					success: function(data) {
						_oFile = data;
					}
				});
				return _oFile;
			};

			// create
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/SWF_FLEX_TEMPLATE_SRV/"
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 10
			});

			// simulate
			var sPath = jQuery.sap.getModulePath("zgestion.petofer.localService.workflowTemplateService");
			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath + "/mockdata",
				bGenerateMissingMockData: false,
				aEntitySetsNames: ["I_WorkflowTemplate_VH"]
			});

			var aRequests = oMockServer.getRequests();

			aRequests.push({
				method: "GET",
				path: /.*I_WorkflowTemplate_VH.*/,
				response: function(oXhr) {
					var oResults = fnGetFromFile("I_WorkflowTemplate_VH.json", "json");
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