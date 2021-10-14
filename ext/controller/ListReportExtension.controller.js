/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("zgestion.petofer.ext.controller.ListReportExtension", {
	onInit: function () {
		this.oNavigationController = this.extensionAPI.getNavigationController();

		this.test();
	},
	test: function () {
		sap.ui.getCore().byId(
			"zgestion.petofer::sap.suite.ui.generic.template.ListReport.view.ListReport::C_RequestForQuotationEnhWD--listReport").attachBeforeRebindTable(
			function (oEvent) {
				var user, mBindingParams = oEvent.getParameter("bindingParams");
				user = sap.ushell.Container.getUser().getFullName();
				mBindingParams.filters.push(new sap.ui.model.Filter("to_ContactCard/FullName", "EQ", user));
			});
	},
	getPredefinedValuesForCreateExtension: function (s) {
		var r = {};
		var S = s.getUiState().getSelectionVariant();
		var a = S.SelectOptions;
		var t = function (f) {
			for (var i = 0; i < a.length; i++) {
				var o = a[i];
				if (o.PropertyName === f) {
					if (o.Ranges.length === 1) {
						var F = o.Ranges[0];
						if (F.Sign === "I" && F.Option === "EQ") {
							r[f] = F.Low;
						}
					}
					break;
				}
			}
		};
		t("PurchasingOrganization");
		t("PurchasingGroup");
		t("CompanyCode");
		t("DocumentCurrency");
		return r;
	},
	onCreateWithDocType: function (e) {
		var c = e.getSource();
		this.loadRFQTypesAndPrepareActionSheet(c, false);
	},
	loadRFQTypesAndPrepareActionSheet: function (b, w) {
		var v = this.getView();
		var m = v.getModel();
		var o = "oData";
		var e = Object.keys(m[o]);
		var r = [];
		for (var i = 0; i < e.length; i++) {
			if (/C_RFQTypeValueHelp.*/.test(e[i])) {
				r.push(m.getProperty("/" + e[i]));
			}
		}
		if (r.length === 0) {
			m.read("/C_RFQTypeValueHelp", {
				success: jQuery.proxy(function (R) {
					var a = R.results;
					this._createActionSheet(a, b);
				}, this),
				error: jQuery.proxy(function (R) {
					this._showErrorDialog(v, "NO_RFQ_TYPES_ERROR_TEXT");
					jQuery.sap.log.error(R);
				}, this)
			});
		} else {
			this._createActionSheet(r, b, w);
		}
	},
	_createActionSheet: function (r, b, w) {
		if (r.length === 1) {
			var R = r.pop();
			this._createRFQ(R.RFQType, w);
		} else if (r.length > 1) {
			var a;
			if (!this._actionSheetForCreateRFQ && !w) {
				this._actionSheetForCreateRFQ = new sap.m.ActionSheet(
					"zgestion.petofer::sap.suite.ui.generic.template.ListReport.view.Details::createRFQActionSheet");
				this._createButtonsForActionSheet(this._actionSheetForCreateRFQ, r, w);
				this.getView().addDependent(this._actionSheetForCreateRFQ);
			}
			a = this._actionSheetForCreateRFQ;
			a.openBy(b);
		} else {
			this._showErrorDialog(this.getView(), "NO_RFQ_TYPES_ERROR_TEXT");
			jQuery.sap.log.error("RFQ types are not maintained. Please contact your system administrator.");
		}
	},
	_createButtonsForActionSheet: function (a, r, w) {
		for (var i = 0; i < r.length; i++) {
			var b = new sap.m.Button({
				text: r[i].RFQType_Text,
				press: jQuery.proxy(this._createRFQ, this, r[i].RFQType, w)
			});
			a.addButton(b);
		}
	},
	_createRFQ: function (d, w) {
		var v = this.getView();
		var m = v.getModel();
		var s = this.getView().byId(
			"zgestion.petofer::sap.suite.ui.generic.template.ListReport.view.ListReport::C_RequestForQuotationEnhWD--listReportFilter");
		var D = {};
		D.PurchasingDocumentType = d;
		m.create("/C_RequestForQuotationEnhWD", D, {
			success: jQuery.proxy(function (r) {
				var c = m.createBindingContext("/C_RequestForQuotationEnhWD(RequestForQuotation='',DraftUUID=guid'" + r.DraftUUID +
					"',IsActiveEntity=false)");
				this.oNavigationController.navigateInternal(c);
			}, this),
			error: jQuery.proxy(function (r) {
				this._showErrorDialog(v, "CREATION_OF_RFQ_FAILED");
				jQuery.sap.log.error(r);
			}, this)
		});
	},
	_showErrorDialog: function (v, e) {
		var i = "i18n";
		var d = new sap.m.Dialog({
			title: v.getModel(i).getResourceBundle().getText("ERROR_DIALOG_TITLE"),
			type: "Message",
			state: "Error",
			content: new sap.m.Text({
				text: v.getModel(i).getResourceBundle().getText(e)
			}),
			beginButton: new sap.m.Button({
				text: v.getModel(i).getResourceBundle().getText("OK_BUTTON"),
				press: function () {
					d.close();
				}
			}),
			afterClose: function () {
				d.destroy();
			}
		}).open();
	}
});