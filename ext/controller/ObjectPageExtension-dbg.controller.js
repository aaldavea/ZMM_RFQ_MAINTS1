/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("zgestion.petofer.ext.controller.ObjectPageExtension", {

	onInit: function () {
		// sKey and sObjectType have to be set according to the business object
		var sObjectType = "REQUEST_FOR_QUOTATION";
		var sMode = "D";
		var sKey = "RequestForQuotation";
		var sStatusKey = "RFQLifecycleStatus";
		var oController = this;
		var sCurrentKey = "";
		var sRFQStatus = "", cRFQPublished = "02";
		var bHideSendOutputAction = true;

		var oComponentContainer = oController.byId("idOutputControlContainer");

		if (oComponentContainer) {

			//create empty component if not already instantiated
			if (!oController._oOutputComponent) {
				oController._oOutputComponent = sap.ui.getCore().createComponent({
					name: "sap.ssuite.fnd.om.outputcontrol.outputitems",
					id: oController.createId("OutputComponent"),
					settings: {
						editMode: sMode,
						objectId: sCurrentKey,
						objectType: sObjectType,
						showTableTitle: false,
						hideIssueOutputAction: bHideSendOutputAction
					}
				});
				oComponentContainer.setComponent(oController._oOutputComponent);
			}

			//react to model context change to enable lazy loading
			oComponentContainer.attachModelContextChange(function (oEvent) {
				//binding context is changed when object page section gets in visible area
				if (oComponentContainer.getBindingContext()) {
					sCurrentKey = oComponentContainer.getBindingContext().getProperty(sKey);
					sRFQStatus = oComponentContainer.getBindingContext().getProperty(sStatusKey);
					if (sRFQStatus !== undefined && sRFQStatus === cRFQPublished) {
						bHideSendOutputAction = false;
					} else {
						bHideSendOutputAction = true;
					}
					//only change key and refresh if necessary, because the event is also fired on navigation to LR and to document
					if (oController._oOutputComponent.getProperty("objectId") !== sCurrentKey) {
						if(!isNaN(sCurrentKey)){             //2920813
							while (sCurrentKey.length < 10) {    //2920813
								sCurrentKey = '0' + sCurrentKey; //2920813
                        }}
						oController._oOutputComponent.setObjectId(sCurrentKey);
						oController._oOutputComponent.setHideIssueOutputAction(bHideSendOutputAction);
						oController._oOutputComponent.refresh();
					}
				}
			});

		}

		//also refresh after save, because on edit and save the object key does not change
		this.extensionAPI.getTransactionController().attachAfterActivate(function (oPromise) {
			oPromise.activationPromise.then(function (oResponse) {
				sCurrentKey = oResponse.data.RequestForQuotation;
				sRFQStatus = oResponse.data.RFQLifecycleStatus;
				if (sRFQStatus !== undefined && sRFQStatus === cRFQPublished) {
					bHideSendOutputAction = false;
				} else {
					bHideSendOutputAction = true;
				}
				oController._oOutputComponent.setObjectId(sCurrentKey);
				oController._oOutputComponent.setHideIssueOutputAction(bHideSendOutputAction);
				oController._oOutputComponent.refresh();
			});
		});
	},

	onCreateWithContext: function (oEvent) {
		var oView = this.getView();
		var oModel = oView.getModel();
		var sPath = oView.getBindingContext().getPath();
		var sPathBidder = this.extensionAPI.getSelectedContexts(
			"zgestion.petofer::sap.suite.ui.generic.template.ObjectPage.view.Details::C_RequestForQuotationEnhWD--Bidders::Table")[0].getPath();
		var activeKey = oModel.getProperty(sPath).RequestForQuotation;
		var selectedBidder = oModel.getProperty(sPathBidder).Supplier;
		var isCreatePossible = oModel.getProperty(sPathBidder).HasNoSupplierQuotation;

		if (isCreatePossible) {
			this.oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
			if (this.oCrossAppNavigator && this.oCrossAppNavigator.toExternal) {
				this.oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "SupplierQuotation",
						action: "manage"
					},
					params: {
						RequestForQuotation: activeKey,
						Supplier: selectedBidder,
						mode: "createWithContext"
					}
				});
			}
		} else {
			this._showErrorDialog(oView);
		}
	},

	onGetBidderProposal: function (oEvent) {
		var oView = this.getView();
		var oContext = oView.getBindingContext();

		var sPurchasingOrganization = oView.getModel().getProperty(oContext.getPath()).PurchasingOrganization;

		if (sPurchasingOrganization !== "") {

			if (!this._oBidderProposalDialog) {

				//Create dialog
				this._oBidderProposalDialog = sap.ui.xmlfragment("zgestion.petofer.ext.fragment.BidderProposal", this);
				this._oBidderProposalDialog.setBusy(true);
				this._bidderProposalModel = new sap.ui.model.json.JSONModel({});
				this._oBidderProposalDialog.setModel(this._bidderProposalModel, "bidderProposalModel");
				oView.addDependent(this._oBidderProposalDialog);

				var fnIntComparator = function (sValue1, sValue2) {
					var iValue1 = parseInt(sValue1, 10);
					var iValue2 = parseInt(sValue2, 10);
					if (iValue1 === iValue2) {
						return 0;
					}
					return (iValue1 < iValue2 ? -1 : 1);

				};
				var oSorterNumberOfCoveredItems = new sap.ui.model.Sorter("NumberOfCoveredItems", true, false, fnIntComparator);
				var oSorterDaysSinceLastOrder = new sap.ui.model.Sorter("DaysSinceLastOrder", false, false, fnIntComparator);
				var oSorterNumberOfPurchaseOrderItems = new sap.ui.model.Sorter("NumberOfPurchaseOrderItems", true, false, fnIntComparator);
				var oBinding = this._oBidderProposalDialog.getBinding("items");
				oBinding.sort([oSorterNumberOfCoveredItems, oSorterDaysSinceLastOrder, oSorterNumberOfPurchaseOrderItems]);
			}

			var oPromise = this.extensionAPI.invokeActions("/A748DE3ED04E5C405554Get_bidder_proposals", oContext);
			oPromise.then(jQuery.proxy(this._onBidderProposalSuccessCallback, this), jQuery.proxy(this._onBidderProposalErrorCallback, this));

		} else {
			var oDialog = new sap.m.Dialog({
				title: oView.getModel("i18n").getResourceBundle().getText("BIDDER_PROPOSAL_INFO_DIALOG_TITLE"),
				type: "Message",
				state: "None",
				content: new sap.m.Text({
					text: oView.getModel("i18n").getResourceBundle().getText("NO_PURCH_ORG_SET")
				}),
				beginButton: new sap.m.Button({
					text: oView.getModel("i18n").getResourceBundle().getText("LT_OK"),
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			}).open();
		}

	},

	addBidderProposals: function (oEvent) {
		var extensionAPI = this.extensionAPI;
		var oModel = this.getView().getModel();
		var sPathToRFQ = this.getView().getBindingContext().getPath();

		var aSelectedBidderProposals = oEvent.getParameter("selectedItems");

		for (var i = 0; i < aSelectedBidderProposals.length; i++) {
			var sPath = aSelectedBidderProposals[i].getBindingContextPath();
			var oProposal = this._bidderProposalModel.getProperty(sPath);
			oModel.create(sPathToRFQ + "/to_RFQBidderEnhWD", {
				"Supplier": oProposal.Supplier
			}, {
				success: function () {
					extensionAPI.refresh(
						"zgestion.petofer::sap.suite.ui.generic.template.ObjectPage.view.Details::C_RequestForQuotationEnhWD--Bidders::Table"
					);
					extensionAPI.getTransactionController().executeSideEffects({
						sourceEntities: ["to_RFQBidderEnhWD"]
					});
				}
			});
		}

		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter([]);
		this._bidderProposalModel.setData({});

	},

	searchBidderProposals: function (oEvent) {
		var sValue = oEvent.getParameter("value");

		var oFilter = new sap.ui.model.Filter({
			filters: [
				new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("SupplierName", sap.ui.model.FilterOperator.Contains, sValue)
			],
			and: false
		});
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter([oFilter]);
	},

	onCancel: function (oEvent) {
		//var oBinding = oEvent.getSource().getBinding("items");
		//oBinding.filter([]);
		this._bidderProposalModel.setData({});
	},

	_onBidderProposalSuccessCallback: function (aResponse) {
		if (aResponse[0] && aResponse[0].response) {
			this._oBidderProposalDialog.setBusy(false);

			if (aResponse[0].response.data.results.length > 0) {
				this._bidderProposalModel.setData(aResponse[0].response.data);
				this._oBidderProposalDialog.open();
			} else {
				var oView = this.getView();
				var oDialog = new sap.m.Dialog({
					title: oView.getModel("i18n").getResourceBundle().getText("BIDDER_PROPOSAL_INFO_DIALOG_TITLE"),
					type: "Message",
					state: "None",
					content: new sap.m.Text({
						text: oView.getModel("i18n").getResourceBundle().getText("BIDDER_PROPOSAL_INFO_DIALOG_TEXT")
					}),
					beginButton: new sap.m.Button({
						text: oView.getModel("i18n").getResourceBundle().getText("LT_OK"),
						press: function () {
							oDialog.close();
						}
					}),
					afterClose: function () {
						oDialog.destroy();
					}
				}).open();
			}
		}
	},

	_onBidderProposalErrorCallback: function () {
		this._oBidderProposalDialog.setBusy(false);
	},

	_showErrorDialog: function (oView) {
		var oDialog = new sap.m.Dialog({
			title: oView.getModel("i18n").getResourceBundle().getText("LT_ERROR_DIALOG_TITLE"),
			type: "Message",
			state: "Error",
			content: new sap.m.Text({
				text: oView.getModel("i18n").getResourceBundle().getText("CWR_NOT_POSSIBLE")
			}),
			beginButton: new sap.m.Button({
				text: oView.getModel("i18n").getResourceBundle().getText("LT_OK"),
				press: function () {
					oDialog.close();
				}
			}),
			afterClose: function () {
				oDialog.destroy();
			}
		}).open();
	},

	onAssignToLT: function () {
		var oLTVHView = sap.ui.view({
			type: sap.ui.core.mvc.ViewType.XML,
			viewName: "zgestion.petofer.ext.view.LegalTransactionVH"
		});

		this._oLTVHDialog = new sap.m.Dialog({
			title: "{i18n|sap.suite.ui.generic.template.ObjectPage|C_RequestForQuotationEnhWD>LT_SEARCH}",
			contentWidth: "100%",
			contentHeight: "100%",
			stretchOnPhone: true,
			showCloseButton: true,
			beginButton: new sap.m.Button({
				text: "{i18n|sap.suite.ui.generic.template.ObjectPage|C_RequestForQuotationEnhWD>LT_OK}",
				press: jQuery.proxy(this._onPressAssignLT, this, oLTVHView)
			}),
			endButton: new sap.m.Button({
				text: "{i18n|sap.suite.ui.generic.template.ObjectPage|C_RequestForQuotationEnhWD>LT_CANCEL}",
				press: function () {
					this.getParent().close();
				}
			})
		});

		this._oLTVHDialog.addContent(oLTVHView);
		this.getView().addDependent(this._oLTVHDialog);
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oLTVHDialog);

		this._oLTVHDialog.setModel(this.getView().getModel());
		this._oLTVHDialog.open();
	},

	_onPressAssignLT: function (oLTVHView) {
		var aItems = oLTVHView.byId("smartTableLTVH").getTable().getSelectedItems();
		var sRFQPath = oLTVHView.getBindingContext().getPath();
		var idRFQ = oLTVHView.getModel().getProperty(sRFQPath).RequestForQuotation;
		var sPath;
		for (var i = 0; i < aItems.length; i++) {
			sPath = aItems[i].getBindingContextPath();
			var idLT = this.getView().getModel().getProperty(sPath).LegalTransaction;
			var assignLTModel = this.getView().getModel("assignLT");
			assignLTModel.callFunction("/AssignLinkdObjToLglTransExt", {
				success: jQuery.proxy(this._onAssigLTSuccessCallback, this),
				error: jQuery.proxy(this._onAssigLTErrorCallback, this),
				method: "POST",
				urlParameters: {
					LglCntntMLinkdObj: idRFQ,
					LegalTransaction: idLT,
					Lglcntntmintegrationlink: "RFQ"
				}
			});
		}
	},

	_onAssigLTSuccessCallback: function (oData) {
		this._oLTVHDialog.close();
		var oBundle = this.getView().getModel("i18n").getResourceBundle();
		var sLTId = oData.LegalTransaction;
		sap.m.MessageToast.show(oBundle.getText("LT_SUCCESS", [sLTId]));
		this.extensionAPI.refresh(
			"zgestion.petofer::sap.suite.ui.generic.template.ObjectPage.view.Details::C_RequestForQuotationEnhWD--LegalTransaction::Table"
		);
	},

	_onAssigLTErrorCallback: function (oResponse) {
		// get the response text and change it to an JSON object
		var sResponseText = oResponse.responseText;
		var oError = JSON.parse(sResponseText);

		// get the error code and the message value
		var sErrorMessage = oError.error.message.value;

		var oDialog = new sap.m.Dialog({
			title: "{i18n|sap.suite.ui.generic.template.ObjectPage|C_RequestForQuotationEnhWD>LT_ERROR_DIALOG_TITLE}",
			type: "Message",
			state: "Error",
			content: new sap.m.Text({
				text: sErrorMessage
			}),
			beginButton: new sap.m.Button({
				text: "{i18n|sap.suite.ui.generic.template.ObjectPage|C_RequestForQuotationEnhWD>LT_OK}",
				press: function () {
					oDialog.close();
				}
			}),
			afterClose: function () {
				oDialog.destroy();
			}
		});
		this.getView().addDependent(oDialog);
		oDialog.open();
	},

	onChangeLogAction: function () {
		if (!this._oChangeLogDialog) {
			this._oChangeLogDialog = sap.ui.xmlfragment("changeLogFragment", "zgestion.petofer.ext.fragment.ChangeLog", this);

			this.getView().addDependent(this._oChangeLogDialog);
		}

		this._oChangeLogDialog.bindElement({
			path: this.getView().getBindingContext().getPath(),
			events: {
				change: jQuery.proxy(function () {
					sap.ui.getCore().byId(sap.ui.core.Fragment.createId("changeLogFragment", "changeLogDialogId")).setTitle(this.getView().getModel(
						"i18n").getResourceBundle().getText("@CHANGELOG_TITLE", [this.getView().getBindingContext().getObject().RequestForQuotation]));
					this._oChangeLogDialog.open();
				}, this),
				dataReceived: jQuery.proxy(function () {

				}, this)
			}
		});

	},

	onBeforeChangeLogRebind: function (oEvent) {
		var oBindingParameters = oEvent.getParameters().bindingParams,
			that = this;

		if (!oBindingParameters.sorter.length) {

			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				style: "medium"
			});
			oBindingParameters.sorter.push(new sap.ui.model.Sorter("CreationDateTime", true, function (oContext) {
				var oDate = oContext.getProperty("CreationDateTime");
				return {
					key: oDate.toString(),
					text: that.getView().getModel("i18n").getResourceBundle().getText("@CHANGELOG_GROUP_TITLE", [dateFormat.format(oDate), oContext.getProperty(
						"FullName")])
				};
			}));
		}

	},

	handleChangeLogSearch: function (oEvent) {
		var sValue = oEvent.getSource().getValue(),
			oTable = oEvent.getSource().getParent().getParent().getTable(),
			oBinding = oTable.getBinding("items"),
			oModel = oBinding.getModel();
		if (sValue !== "") {
			oBinding.sCustomParams = oModel.createCustomParams({
				custom: {
					search: sValue
				}
			});
		} else {
			oBinding.sCustomParams = [];
		}
		oBinding.filter();
	},

	onCloseChangeLogDialog: function () {
		this._oChangeLogDialog.destroy();
		this._oChangeLogDialog = null;
	}
});