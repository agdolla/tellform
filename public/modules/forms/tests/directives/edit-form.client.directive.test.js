'use strict';

(function() {
    // Forms Controller Spec
    describe('editForm Tests', function() {
        // Initialize global variables
        var el, scope, controller, $httpBackend;

        var sampleUser = {
            firstName: 'Full',
            lastName: 'Name',
            email: 'test@test.com',
            username: 'test@test.com',
            password: 'password',
            provider: 'local',
            roles: ['user'],
            _id: 'ed873933b1f1dea0ce12fab9',
        };

        var pdfObj = {
            fieldname:"file",
            originalname:"test.pdf",
            name:"1440112660375.pdf",
            encoding:"7bit",
            mimetype:"application/pdf",
            path:"uploads/tmp/test@test.com/1440112660375.pdf",
            extension:"pdf",
            size:56223,
            truncated:false,
            buffer:null
        };

        var sampleForm = {
            title: 'Form Title',
            admin: 'ed873933b1f1dea0ce12fab9',
            language: 'english',
            form_fields: [
                {fieldType:'textfield', title:'First Name', fieldValue: '', required: true, disabled: false, deletePreserved: false},
                {fieldType:'checkbox', title:'nascar',      fieldValue: '', required: true, disabled: false, deletePreserved: false},
                {fieldType:'checkbox', title:'hockey',      fieldValue: '', required: true, disabled: false, deletePreserved: false}
            ],
            pdf: {},
            pdfFieldMap: {},
            startPage: {
                showStart: false
            },
            hideFooter: false,
            isGenerated: false,
            isLive: false,
            autofillPDFs: false,
            _id: '525a8422f6d0f87f0e407a33',
        };

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));
        beforeEach(module('stateMock'));
        beforeEach(module('module-templates'));

        beforeEach(inject(function($compile, $controller, $rootScope, _$httpBackend_) {
            //Instantiate directive.
            var tmp_scope = $rootScope.$new();
            tmp_scope.myform = sampleForm;

            //gotacha: Controller and link functions will execute.
            el = angular.element('<edit-form-directive myform="myform"></edit-form-directive>');
            $compile(el)(tmp_scope);
            $rootScope.$digest();

            // Point global variables to injected services
            $httpBackend = _$httpBackend_;

            $httpBackend.whenGET(/.+\.html$/).respond('');
            $httpBackend.whenGET('/users/me/').respond('');

            //Grab controller instance
            controller = el.controller();

            //Grab scope. Depends on type of scope.
            //See angular.element documentation.
            scope = el.isolateScope() || el.scope();

        }));

        it('$scope.addNewField() should ADD a new field to $scope.myform.form_fields', function() {
            scope.addNewField(true, 'textfield');

            var sampleFormField = {
                fieldType:'checkbox', 
                title:'hockey', 
                fieldValue: '', 
                required: true, 
                disabled: false, 
                deletePreserved: false
            };

            expect(scope.myform.form_fields.length).toEqual(sampleForm.form_fields.length+1);
            expect(_.last(scope.myform.form_fields)).toEqualData(sampleFormField);
        });

        it('$scope.deleteField() should DELETE a field to $scope.myform.form_fields', function() {
            scope.deleteField(scope.myform.form_fields[0].$$hashKey);

            expect(scope.myform.form_fields.length).toEqual(sampleForm.form_fields.length-1);
            expect(_.first(scope.myform.form_fields)).toEqualData(sampleForm.form_fields[1]);
        });
    });
}());