/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/util/MockServer"],function(M){"use strict";return{init:function(){var g=function(f){var _=null;$.ajax({async:false,global:false,url:"../localService/businessProccesFlowService/mockdata/"+f,dataType:"json",success:function(d){_=d;}});return _;};var m=new M({rootUri:"/sap/opu/odata/SAP/CA_BPF_LAYOUT_METADATA_SRV/"});M.config({autoRespond:true,autoRespondAfter:100});var p=jQuery.sap.getModulePath("zgestion.petofer.localService.businessProccesFlowService");m.simulate(p+"/metadata.xml",{sMockdataBaseUrl:p+"/mockdata",bGenerateMissingMockData:false,aEntitySetsNames:["C_LaneLayout","C_RFQProcessFlow","C_NodeLayout","I_RequestForQuotation"]});var r=m.getRequests();r.push({method:"GET",path:/.*C_LaneLayout.*filter.*ProcessFlowLayout.*eq.*C_RFQProcessFlow.*/,response:function(x){var R=g("C_LaneLayout.json");x.respond(0,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify(R));return R;}});r.push({method:"GET",path:/.*C_RFQProcessFlow.*filter.*RequestForQuotation.*eq.*7000002791.*/,response:function(x){var R=g("C_RFQProcessFlow_7000002791.json");x.respond(0,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify(R));return R;}});r.push({method:"GET",path:/.*C_RFQProcessFlow.*filter.*RequestForQuotation.*eq.*7000002790.*/,response:function(x){var R=g("C_RFQProcessFlow_7000002790.json");x.respond(0,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify(R));return R;}});r.push({method:"GET",path:/.*C_RFQProcessFlow.*filter.*RequestForQuotation.{0,4}eq(%|2|7|0){0,10}/,response:function(x){var R=g("C_RFQProcessFlow.json");x.respond(0,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify(R));return R;}});r.push({method:"GET",path:/.C_NodeLayout.*filter.*ProcessFlowLayout.*eq.*C_RFQProcessFlow.*/,response:function(x){var R=g("C_NodeLayout.json");x.respond(0,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify(R));return R;}});r.push({method:"GET",path:/.*I_RequestForQuotation.*RequestForQuotation.*7000002791.*select.*RFQLifecycleStatus.*CreationDate.*QuotationLatestSubmissionDate.*/,response:function(x){var R=g("I_RequestForQuotation_7000002791.json");x.respond(0,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify(R));return R;}});r.push({method:"GET",path:/.*I_RequestForQuotation.*RequestForQuotation.*7000002790.*select.*RFQLifecycleStatus.*CreationDate.*QuotationLatestSubmissionDate.*/,response:function(x){var R=g("I_RequestForQuotation_7000002790.json");x.respond(0,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify(R));return R;}});m.setRequests(r);m.start();}};});