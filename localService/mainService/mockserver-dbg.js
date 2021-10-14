/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";
	var oMockServer,
		_sAppModulePath = "zgestion.petofer/",
		fnGetJSONFromFile = function(sFileName) {
			var _oJSON = null;
			$.ajax({
				async: false,
				global: false,
				url: "../localService/mainService/mockdata/" + sFileName,
				dataType: "json",
				success: function(data) {
					_oJSON = data;
				}
			});
			return _oJSON;
		};

	return {

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		init: function() {
			var sManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + "manifest", ".json"),
				oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
				oDataSource = oManifest["sap.app"].dataSources;

			for (var sDataSourceName in oDataSource) {
				if (oDataSource[sDataSourceName].type === "OData" && sDataSourceName === "mainService") {
					this.createMockServer(oDataSource, sDataSourceName);
				}
			}
		},

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		createMockServer: function(oDataSource, sDataSourceName) {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sEntity = "C_RequestForQuotation",
				sErrorParam = oUriParameters.get("errorType"),
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
				oMainDataSource = oDataSource[sDataSourceName],
				sMetadataUrl = jQuery.sap.getModulePath(_sAppModulePath + oMainDataSource.settings.localUri.replace(".xml", ""), ".xml"),
				sMockServerPath = sMetadataUrl.slice(0, sMetadataUrl.lastIndexOf("/") + 1),
				// ensure there is a trailing slash
				sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/",
				aAnnotations = oMainDataSource.settings.annotations || [];

			oMockServer = new MockServer({
				rootUri: sMockServerUrl
			});

			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 100
			});

			// load local mock data
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockServerPath + "mockdata",
				bGenerateMissingMockData: true,
				aEntitySetsNames: ["C_RequestForQuotationEnhWD", "C_RFQTypeValueHelp", "I_RFQLifecycleStatus", "C_RFQItemEnhWD",
					"C_RequestForQuotationEnhWDEdit", "I_FormOfAddress"
				]
			});

			var aRequests = oMockServer.getRequests(),

				fnResponse = function(iErrCode, sMessage, aRequest) {
					aRequest.response = function(oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				};

			// handling the metadata error test
			if (oUriParameters.get("metadataError")) {
				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf("$metadata") > -1) {
						fnResponse(500, "metadata Error", aEntry);
					}
				});
			}

			// Handling request errors
			if (sErrorParam) {
				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf(sEntity) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
				});
			}

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*skip=0.*top=25.*orderby=RequestForQuotation.*desc.*inlinecount=allpages.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*skip=25.*top=25.*orderby=RequestForQuotation.*desc.*inlinecount=allpages.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_next_25_RFQs.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002791.*DraftUUID.*guid.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002791.json");

					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));

					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002790.*DraftUUID.*guid.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002790.json");

					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));

					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002791.*DraftUUID.*guid.*8cdcd400-0c70-1ed7-b9aa-391e3b767904.*IsActiveEntity.*false.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002791.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RFQTypeValueHelp.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RFQTypeValueHelp.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_PurchasingOrgValueHelp.*skip=0.*top=10.*search-focus=PurchasingOrganization.*search=.*select=PurchasingOrganization.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_PurchasingOrgValueHelp.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});
			
			aRequests.push({
				method: "GET",
				path: /.*I_RFQLifecycleStatus.*skip=0.*top=100.*orderby=RFQLifecycleStatus_Text.*select=RFQLifecycleStatus.*RFQLifecycleStatus_Text.*inlinecount.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("I_RFQLifecycleStatus.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002791.*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*to_RFQItemEnhWD.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002791_to_RFQItemEnhWD.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002791.*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*to_RFQBidderEnhWD.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002791_to_RFQBidderEnhWD.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002790.*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*to_RFQItemEnhWD.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002790_to_RFQItemEnhWD.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002790.*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*to_RFQBidderEnhWD.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002790_to_RFQBidderEnhWD.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002791.*DraftUUID.*8cdcd400-0c70-1ed7-b9aa-391e3b767904.*IsActiveEntity.*true.*to_RFQItemEnhWD.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002791_Draft_to_RFQItemEnhWD.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002791.*DraftUUID.*8cdcd400-0c70-1ed7-b9aa-391e3b767904.*IsActiveEntity.*true.*to_RFQBidderEnhWD.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002791_Draft_to_RFQBidderEnhWD.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*700000279[0-1].*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*to_SupplierQuotation.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002791_to_SupplierQuotations.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*700000279[0-1].*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*to_LegalTransaction.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002791_to_LegalTransaction.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002791.*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*to_SupplierQuotation.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002791_to_SupplierQuotations.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002791.*DraftUUID.*8cdcd400-0c70-1ed7-b9aa-391e3b767904.*IsActiveEntity.*true.*to_LegalTransaction.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002791_to_LegalTransaction.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RFQItemEnhWD.*RequestForQuotation.*7000002791.*RequestForQuotationItem.*00010.*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*expand.*to_OrderQuantityUnit.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RFQItemEnhWD_7000002791.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RFQItemEnhWD.*RequestForQuotation.*7000002791.*RequestForQuotationItem.*00010.*DraftUUID.*8cdcd400-0c70-1ed7-b9aa-391e3b767904.*IsActiveEntity.*true.*expand.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RFQItemEnhWD_7000002791_Draft00000000-0000-0000-0000-000000000000.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RFQItemEnhWD.*RequestForQuotation.*7000002791.*RequestForQuotationItem.*00010.*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*to_AddressTP.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RFQItemEnhWD_7000002791_to_AddressTP.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RFQItemEnhWD.*RequestForQuotation.*7000002791.*RequestForQuotationItem.*00010.*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*DraftAdministrativeData.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RFQItemEnhWD_7000002791_DraftAdministrativeData.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "POST",
				path: /.*C_RequestForQuotationEnhWDEdit.*RequestForQuotation.*7000002791.*DraftUUID.*guid.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWDEdit_7000002791.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "POST",
				path: /.*I_FormOfAddress.*$skip.*0.*$top.*100.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("I_FormOfAddress_skip_0_top_100.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*7000002791.*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*to_RFQLifecycleStatus.*to_RFQBidderEnhWD.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_7000002791_published.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			// Create RFQ Handler Requests			

			aRequests.push({
				method: "POST",
				path: /.*C_RequestForQuotationEnhWD(?!Edit).*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_Post.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*DraftUUID.*42f2e9af-c4ef-1ee7-b9b1-6fb83d3fd7f7.*IsActiveEntity.*false.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_Draft.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*DraftUUID.*42f2e9af-c4ef-1ee7-b9b1-6fb83d3fd7f7.*IsActiveEntity.*false.*to_RFQItemEnhWD.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_Draft_to_RFQItemEnhWD.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*DraftUUID.*42f2e9af-c4ef-1ee7-b9b1-6fb83d3fd7f7.*IsActiveEntity.*false.*to_RFQBidderEnhWD.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_Draft_to_RFQBidderEnhWD.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*DraftUUID.*42f2e9af-c4ef-1ee7-b9b1-6fb83d3fd7f7.*IsActiveEntity.*false.*to_SupplierQuotation.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_Draft_to_SupplierQuotation.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "GET",
				path: /.*C_RequestForQuotationEnhWD.*RequestForQuotation.*DraftUUID.*42f2e9af-c4ef-1ee7-b9b1-6fb83d3fd7f7.*IsActiveEntity.*false.*to_LegalTransaction.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("C_RequestForQuotationEnhWD_Draft_to_LegalTransactionto_LegalTransaction.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			aRequests.push({
				method: "POST",
				path: /.*Submit_for_approval.*RequestForQuotation.*7000002791.*DraftUUID.*00000000-0000-0000-0000-000000000000.*IsActiveEntity.*true.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("Submit_for_approval_7000002791.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			// DELETE Draft 
			aRequests.push({
				method: "DELETE",
				path: /.*C_RequestForQuotationEnhWD.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("nothing.text");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});
			
			// bidder poroposal 
			aRequests.push({
				method: "POST",
				path: /.*Get_bidder_proposals.*RequestForQuotation.*/,
				response: function(oXhr) {
					var oResults = fnGetJSONFromFile("Get_bidder_proposals_7000002791.json");
					oXhr.respond(0, {
						"Content-Type": "application/json;charset=utf-8"
					}, JSON.stringify(oResults));
					return oResults;
				}
			});

			// add the local request handlers to the mock server (for requests that can not be handled automatically by the mock server)

			MockServer.prototype.setRequests.apply(oMockServer, [aRequests]);
			oMockServer.start();

			jQuery.sap.log.info("Running the app with mock data");

			//create mock servers to handle the get requests for the annotation files (one for each data source defined in the manifest) 
			aAnnotations.forEach(function(sAnnotationName) {
				var oAnnotation = oDataSource[sAnnotationName],
					sUri = oAnnotation.uri,
					sLocalUri = jQuery.sap.getModulePath(_sAppModulePath + oAnnotation.settings.localUri.replace(".xml", ""), ".xml");

				///annotations
				new MockServer({
					rootUri: sUri,
					requests: [{
						method: "GET",
						path: new RegExp(".*"),
						response: function(oXhr) {
							jQuery.sap.require("jquery.sap.xml");
							var oAnnotations = jQuery.sap.sjax({
								url: sLocalUri,
								dataType: "xml"
							}).data;
							oXhr.respondXML(200, {}, jQuery.sap.serializeXML(oAnnotations));
							return true;
						}
					}]

				}).start();

			});

		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer}
		 */
		getMockServer: function() {
			return oMockServer;
		}
	};

});