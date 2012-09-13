/*
Copyright 2010 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0. 
ou may not use this file except in compliance with this License.

You may obtain a copy of the ECL 2.0 License at
https://source.collectionspace.org/collection-space/LICENSE.txt
 */

/*global jqUnit, jQuery, cspace:true, fluid, start, stop, ok, expect*/
"use strict";

cspace.test = cspace.test || {};

var sidebarTester = function ($) {
    var container = "#main",
        setupSidebar = function (options) {
            return cspace.sidebar(container, options);
        },
        //returns full permissions except for those specified in the array noperm,
        //which will not have any permissions
        getLimitedPermissions = function(noperm) {
            var returnPerms = {};
            fluid.model.copyModel(returnPerms, cspace.tests.fullPerms);
            fluid.each(noperm, function(val) {
                returnPerms[val] = [];
            });
            return returnPerms;
        },
        bareSidebarTest = new jqUnit.TestCase("Sidebar Tests"),
        //test both permissions and cataloging are showing
        sidebarTest = cspace.tests.testEnvironment({
            testCase: bareSidebarTest,
            permissions: cspace.tests.sampleUserPerms
        }),
        //test not rendering cataloging
        noCatalogingSidebarTest = cspace.tests.testEnvironment({
            testCase: bareSidebarTest,
            permissions: getLimitedPermissions(["cataloging", "loanout"])
        }),
        //test not rendering procedures
        noProceduresSidebarTest = cspace.tests.testEnvironment({
            testCase: bareSidebarTest,
            permissions: getLimitedPermissions(["intake", "loanin", "loanout", "acquisition", "movement", "objectexit", "media"])
        }),
        //test non-linking cataloging (no read permissions)
        noReadCatalogingAndPersonSidebarTest = cspace.tests.testEnvironment({
            testCase: bareSidebarTest,
            permissions: (function () {
                var returnPerms = {};
                fluid.model.copyModel(returnPerms, cspace.tests.fullPerms);
                returnPerms["cataloging"] = ["create", "update", "delete", "list"];
                returnPerms["person"] = ["create", "update", "delete", "list"];
                return returnPerms;
            })()
        }),
        mediaSnapshotTest = cspace.tests.testEnvironment({
            testCase: bareSidebarTest,
            permissions: cspace.tests.sampleUserPerms
        }),
        checkPanelExistence = function(relatedCatalogingShown, relatedProceduresShown) {
            var sidebar = setupSidebar();
            jqUnit.assertEquals("Related Cataloging shown", (relatedCatalogingShown) ? 1 : 0, sidebar.locate("relatedCataloging").length);
            jqUnit.assertEquals("Related Procedures shown", (relatedProceduresShown) ? 1 : 0, sidebar.locate("relatedProcedures").length);
        },
        testScenarios = {
/*
            "RelatedRecordsList: all rendered": {
                testEnv: sidebarTest,
                func: function () {
                    checkPanelExistence(true, true);
                }
            },
            "RelatedRecordsList: cataloging not rendering": {
                testEnv: noCatalogingSidebarTest,
                func: function () {
                    checkPanelExistence(false, true);
                }
            },
            "RelatedRecordsList: procedures not rendering": {
                testEnv: noProceduresSidebarTest,
                func: function () {
                    checkPanelExistence(true, false);
                }
            },
            "RelatedRecordsList: cataloging and persons not linking when no read permissions": {
                testEnv: noReadCatalogingAndPersonSidebarTest,
                func: function () {
                    var sidebar = setupSidebar({
                            primary: "objectexit"
                        }),
                        globalModel = noReadCatalogingAndPersonSidebarTest.globalModel,
                        model = {},
                        applier = fluid.makeChangeApplier(model),
                        modelSpec = {
                            primaryModel: {
                                model: model,
                                applier: applier
                            }
                        },
                        rowCss = ".csc-listView-row",
                        disabledClass = "cs-disabled";
                    
                    globalModel.attachModel(modelSpec);
                    globalModel.applier.requestChange("primaryModel.csid", "aa643807-e1d1-4ca2-9f9b");

                    jqUnit.assertTrue("All rows in a related Cataloging section should be disabled", $(rowCss, sidebar.locate("relatedCataloging")).hasClass(disabledClass));
                    jqUnit.assertFalse("Related Procedures not disabled", $(rowCss, sidebar.locate("relatedProcedures")).hasClass(disabledClass));
                    jqUnit.assertEquals("There is only 1 person in Terms Used section and it is disabled", 1, $("."+disabledClass, sidebar.locate("relatedVocabularies")).length);
                }
            },
*/
            "Media Snapshot test": {
                testEnv: mediaSnapshotTest,
                func: function () {
                    var sidebar = setupSidebar({
                            primary: "objectexit"
                        }),
                        globalModel = mediaSnapshotTest.globalModel,
                        model = {},
                        applier = fluid.makeChangeApplier(model),
                        modelSpec = {
                            primaryModel: {
                                model: model,
                                applier: applier
                            }
                        },
                        rowCss = ".csc-listView-row",
                        disabledClass = "cs-disabled",
                        mediumImage = ".csc-mediaView-mediumImage";
                    
                    globalModel.attachModel(modelSpec);
                    globalModel.applier.requestChange("primaryModel", {
                        csid: "aa643807-e1d1-4ca2-9f9b",
                        fields: {
                            blobs: [
                                {
                                    "updatedAt": "2011-05-10T15:10:33Z",
                                    "height": "67",
                                    "createdAt": "2011-05-10T15:10:33Z",
                                    "name": "CSpaceLogo.png",
                                    "width": "349",
                                    "length": "2108",
                                    "mimeType": "image/png",
                                    "depth": "8",
                                    "imgOrig": "../../../../test/data/images/Original.png",
                                    "imgThumb": "../../../../test/data/images/Thumbnail.jpeg",
                                    "imgMedium": "../../../../test/data/images/Medium.jpeg",
                                    "measuredPartGroup": [
                                        {
                                            "dimensionSummary": "This is dimension summary",
                                            "_primary": true,
                                            "measuredPart": "frame",
                                            "dimensionSubGroup": [
                                                {
                                                    "_primary": true,
                                                    "dimension": "area",
                                                    "measuredBy": "urn:cspace:org.collectionspace.demo:personauthority:name(person):person:name(johnsmith)'John+Smith'",
                                                    "measurementUnit": "carats",
                                                    "measurementMethod": "protractor",
                                                    "value": "123",
                                                    "valueDate": "July 2, 2010",
                                                    "valueQualifier": "exact"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            blobCsid: "aa643807-e1d1-4ca2-9f9b"
                        }
                    });
                    
                    jqUnit.assertTrue("Media snapshot", $(mediumImage, sidebar.locate("media")).length > 0);
                    jqUnit.assertTrue("Media snapshot has source", ($(mediumImage).attr("src") !== 'undefined'));
                    jqUnit.assertTrue("Media snapshot has appropriate derivative", (/Medium/.test($(mediumImage).attr("src"))));
                    
                    
/*                     applier.requestChange("relations.media.0.summarylist.imgThumb", "../data/images/2Thumbnail.jpeg"); */
                    mediaSnapshotTest.globalEvents.events.relationsUpdated.fire("media");
                    jqUnit.assertTrue("Media snapshot updates dynamically when related media is added", 
                        (($(mediumImage).attr("src") !== 'undefined') && (/2Medium/.test($(mediumImage).attr("src")))));
                }
            }
        };
        
    $.each(testScenarios, function(message, options){
        options.testEnv.test(message, options.func);
    });
};

jQuery(document).ready(function () {
    sidebarTester(jQuery);
});