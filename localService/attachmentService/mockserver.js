/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/util/MockServer"],function(M){"use strict";return{init:function(){var g=function(f){var _=null;$.ajax({async:false,global:false,url:"../localService/attachmentService/mockdata/"+f,dataType:"json",success:function(d){_=d;}});return _;};var m=new M({rootUri:"/sap/opu/odata/sap/CV_ATTACHMENT_SRV/"});M.config({autoRespond:true,autoRespondAfter:100});var p=jQuery.sap.getModulePath("zgestion.petofer.localService.attachmentService");m.simulate(p+"/metadata.xml",{sMockdataBaseUrl:p+"/mockdata",bGenerateMissingMockData:false,aEntitySetsNames:["GetAllOriginals","GetArchiveLinkAttachments"]});var r=m.getRequests();r.push({method:"GET",path:/.*GetAllOriginals.*/,response:function(x){var R=g("GetAllOriginals_7000002791.json");x.respond(0,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify(R));return R;}});r.push({method:"GET",path:/.*GetArchiveLinkAttachments.*/,response:function(x){var R=g("GetArchiveLinkAttachments.json");x.respond(0,{"Content-Type":"application/json;charset=utf-8"},JSON.stringify(R));return R;}});m.setRequests(r);m.start();}};});