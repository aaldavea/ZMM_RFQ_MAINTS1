/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/util/MockServer"],function(M){"use strict";return{init:function(){var m=new M({rootUri:"/sap/opu/odata/sap/LCM_LEGALTR_MANAGE/"});M.config({autoRespond:true,autoRespondAfter:100});var p=jQuery.sap.getModulePath("zgestion.petofer.localService.legalTransactionService");m.simulate(p+"/metadata.xml",{bGenerateMissingMockData:false,aEntitySetsNames:["LglCntntMDatePeriodCollection"]});m.start();}};});