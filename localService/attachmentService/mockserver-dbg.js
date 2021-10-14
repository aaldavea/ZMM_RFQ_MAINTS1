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
					url: "../localService/attachmentService/mockdata/" + sFileName,
					dataType: "json",
					success: function(data) {
						_oJSON = data;
					}
				});
				return _oJSON;
			};
			// create
			var oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/CV_ATTACHMENT_SRV/"
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 100
			});

			// simulate
			var sPath = jQuery.sap.getModulePath("zgestion.petofer.localService.attachmentService");
			oMockServer.simulate(sPath + "/metadata.xml", {
				sMockdataBaseUrl: sPath + "/mockdata",
				bGenerateMissingMockData: false,
				aEntitySetsNames: ["GetAllOriginals", "GetArchiveLinkAttachments"]
			});
			
			var aRequests = oMockServer.getRequests();
			
			aRequests.push({
				method: "GET",
				path: /.*GetAllOriginals.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("GetAllOriginals_7000002791.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});
			
			aRequests.push({
				method: "GET",
				path: /.*GetArchiveLinkAttachments.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("GetArchiveLinkAttachments.json");
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