/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/util/MockServer"],function(M){"use strict";return{init:function(){var m=new M({rootUri:"/sap/opu/odata/sap/SGBT_NTE_CDS_API_SRV/"});M.config({autoRespond:true,autoRespondAfter:100});var p=jQuery.sap.getModulePath("zgestion.petofer.localService.notesNoDraftService");m.simulate(p+"/metadata.xml",{bGenerateMissingMockData:false,aEntitySetsNames:["C_Sgbt_Nte_Cds_Apitp"]});m.start();}};});