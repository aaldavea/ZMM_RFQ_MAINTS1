/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("zgestion.petofer.ext.controller.ListReportExtension", {

	onInit: function () {
		this.oNavigationController = this.extensionAPI.getNavigationController();
	},

	getPredefinedValuesForCreateExtension: function (oSmartFilterBar) {
		var oRet = {};
		var oSelectionVariant = oSmartFilterBar.getUiState().getSelectionVariant();
		var aSelectOptions = oSelectionVariant.SelectOptions;
		var fnTransfer = function (sFieldname) {
			for (var i = 0; i < aSelectOptions.length; i++) {
				var oSelectOption = aSelectOptions[i];
				if (oSelectOption.PropertyName === sFieldname) {
					if (oSelectOption.Ranges.length === 1) {
						var oFilter = oSelectOption.Ranges[0];
						if (oFilter.Sign === "I" && oFilter.Option === "EQ") {
							oRet[sFieldname] = oFilter.Low;
						}
					}
					break;
				}
			}
		};
		// look for the available default parametrs 
		fnTransfer("PurchasingOrganization");
		fnTransfer("PurchasingGroup");
		fnTransfer("CompanyCode");
		fnTransfer("DocumentCurrency");

		return oRet;
	},

/*	onCreateWithDefaultValues: function (oEvent) {

		var oCreateWithDefaultValuesButton = oEvent.getSource();
		this.loadRFQTypesAndPrepareActionSheet(oCreateWithDefaultValuesButton, true);
	},*/

	onCreateWithDocType: function (oEvent) {

		var oCreateButton = oEvent.getSource();
		this.loadRFQTypesAndPrepareActionSheet(oCreateButton, false);

	},

	loadRFQTypesAndPrepareActionSheet: function (oButton, bWithDefaultValues) {
		var oView = this.getView();
		var oModel = oView.getModel();
		var sOData = "oData";
		var aEntityPath = Object.keys(oModel[sOData]);
		var aRFQType = [];

		for (var i = 0; i < aEntityPath.length; i++) {
			if (/C_RFQTypeValueHelp.*/.test(aEntityPath[i])) {
				aRFQType.push(oModel.getProperty("/" + aEntityPath[i]));
			}
		}

		if (aRFQType.length === 0) {
			oModel.read("/C_RFQTypeValueHelp", {
				success: jQuery.proxy(function (oResponse) {
					var aResults = oResponse.results;
					this._createActionSheet(aResults, oButton);
				}, this),
				error: jQuery.proxy(function (oResponse) {
					this._showErrorDialog(oView, "NO_RFQ_TYPES_ERROR_TEXT");
					jQuery.sap.log.error(oResponse);
				}, this)
			});
		} else {
			this._createActionSheet(aRFQType, oButton, bWithDefaultValues);
		}
	},

	_createActionSheet: function (aRFQType, oButton, bWithDefaultValues) {
		if (aRFQType.length === 1) {
			var oRFQType = aRFQType.pop();
			this._createRFQ(oRFQType.RFQType, bWithDefaultValues);
		} else if (aRFQType.length > 1) {

			var oActionSheet;
			/*if (!this._actionSheetForCreateRFQDefaultValues && bWithDefaultValues) {
				this._actionSheetForCreateRFQDefaultValues = new sap.m.ActionSheet(
					"zgestion.petofer::sap.suite.ui.generic.template.ListReport.view.Details::createRFQActionSheetWithDefaultValues");
				this._createButtonsForActionSheet(this._actionSheetForCreateRFQDefaultValues, aRFQType, bWithDefaultValues);
				this.getView().addDependent(this._actionSheetForCreateRFQDefaultValues);
				
				// to manifest.json
				,
				"CreateWithDefaultValues": {
					"id": "createWithDefaultValues",
					"press": "onCreateWithDefaultValues",
					"requiresSelection": false,
					"text": "{{createWithDefaultValues}}",
					"applicablePath": "HasNoSupplierQuotation"
				}
				
			}*/
			if (!this._actionSheetForCreateRFQ && !bWithDefaultValues) {
				this._actionSheetForCreateRFQ = new sap.m.ActionSheet(
					"zgestion.petofer::sap.suite.ui.generic.template.ListReport.view.Details::createRFQActionSheet");
				this._createButtonsForActionSheet(this._actionSheetForCreateRFQ, aRFQType, bWithDefaultValues);
				this.getView().addDependent(this._actionSheetForCreateRFQ);
			}

			oActionSheet = this._actionSheetForCreateRFQ;
			/*if (bWithDefaultValues) {
				oActionSheet = this._actionSheetForCreateRFQDefaultValues;
			}*/
			oActionSheet.openBy(oButton);
		} else {
			this._showErrorDialog(this.getView(), "NO_RFQ_TYPES_ERROR_TEXT");
			jQuery.sap.log.error("RFQ types are not maintained. Please contact your system administrator.");
		}
	},

	_createButtonsForActionSheet: function (oActionSheet, aRFQType, bWithDefaultValues) {
		for (var i = 0; i < aRFQType.length; i++) {
			var oButton = new sap.m.Button({
				text: aRFQType[i].RFQType_Text,
				press: jQuery.proxy(this._createRFQ, this, aRFQType[i].RFQType, bWithDefaultValues)
			});
			oActionSheet.addButton(oButton);
		}

	},

	_createRFQ: function (sDocType, bWithDefaultValues) {
		var oView = this.getView();
		var oModel = oView.getModel();
		var oSmartFilterBar = this.getView().byId(
			"zgestion.petofer::sap.suite.ui.generic.template.ListReport.view.ListReport::C_RequestForQuotationEnhWD--listReportFilter");

		var oDataForEntry = {};

		/*if (bWithDefaultValues) {
			oDataForEntry = this.getPredefinedValuesForCreateExtension(oSmartFilterBar);
		}*/
		oDataForEntry.PurchasingDocumentType = sDocType;

		oModel.create("/C_RequestForQuotationEnhWD", oDataForEntry, {
			success: jQuery.proxy(function (oResponse) {
				var oContext = oModel.createBindingContext("/C_RequestForQuotationEnhWD(RequestForQuotation='',DraftUUID=guid'" + oResponse.DraftUUID +
					"',IsActiveEntity=false)");
				this.oNavigationController.navigateInternal(oContext);
			}, this),
			error: jQuery.proxy(function (oResponse) {
				this._showErrorDialog(oView, "CREATION_OF_RFQ_FAILED");
				jQuery.sap.log.error(oResponse);
			}, this)
		});
	},

	_showErrorDialog: function (oView, sErrorText) {
		var sI18nModelName = "i18n";
		var oDialog = new sap.m.Dialog({
			title: oView.getModel(sI18nModelName).getResourceBundle().getText("ERROR_DIALOG_TITLE"),
			type: "Message",
			state: "Error",
			content: new sap.m.Text({
				text: oView.getModel(sI18nModelName).getResourceBundle().getText(sErrorText)
			}),
			beginButton: new sap.m.Button({
				text: oView.getModel(sI18nModelName).getResourceBundle().getText("OK_BUTTON"),
				press: function () {
					oDialog.close();
				}
			}),
			afterClose: function () {
				oDialog.destroy();
			}
		}).open();
	}

});