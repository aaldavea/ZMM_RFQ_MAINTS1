/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/util/MockServer"],function(M){"use strict";return{init:function(){var g=function(f,t){var _=null;$.ajax({async:false,global:false,url:"../localService/workflowService/mockdata/"+f,dataType:t,success:function(d){_=d;}});return _;};var m=new M({rootUri:"/sap/opu/odata/sap/SWF_FLEX_DEF_SRV/"});M.config({autoRespond:true,autoRespondAfter:10});var p=jQuery.sap.getModulePath("zgestion.petofer.localService.workflowService");m.simulate(p+"/metadata.xml",{sMockdataBaseUrl:p+"/mockdata",bGenerateMissingMockData:false,aEntitySetsNames:["WorkflowTemplates"]});var r=m.getRequests();r.push({method:"GET",path:/.*GetApplicationWorkflowInstances.*/,response:function(x){var R=g("GetApplicationWorkflowInstance.json","json");x.respond(0,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify(R));return R;}});r.push({method:"GET",path:/.*SimulateApplicationWorkflowInstances.*/,response:function(x){var R=g("GetApplicationWorkflowInstance.json","json");x.respond(0,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify(R));return R;}});m.setRequests(r);m.start();}};});