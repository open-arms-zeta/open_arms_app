/**
 * Created by PYC on 12/18/15.
 */
myApp.directive('modalDialog', function() {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function(scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            //scope.hideModal = function() {
            //    scope.show = !scope.show;
            //};
        },
        template: "<div class='ng-modal' ng-show='show'>" +
        "<div class='ng-modal-overlay'></div>" +
        "<md-content class='ng-modal-dialog'>" +
        //"<div class='ng-modal-close' ng-click='hideModal()'>X</div>" +
        "<div class='ng-modal-dialog-content' ng-transclude></div></md-content>" +
        "</div>"
    };
});
