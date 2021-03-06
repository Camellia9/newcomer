/**
 * Created by hjzheng on 16/6/16.
 */
(function() {

	angular.module('app', []);

	angular.module('app').filter('prettyJSON', function() {
		function prettyPrintJson(json) {
			return JSON ? JSON.stringify(json, null, '  ') : 'your browser doesnt support JSON so cant pretty print';
		}
		return prettyPrintJson;
	});

	angular.module('app').controller('MainController', function($scope) {

		$scope.select = function(item) {
			console.log(item);
		};

		$scope.tree = [{
			id: 1,
			label: '所有工单类型',
			children: [
				{
					id: 2,
					label: '售前事务',
					children: [
						{
							id: 21,
							label: '催付工单'
						},
						{
							id: 22,
							label: '发货提醒工单',
							children: [
								{
									id: 224,
									label: '催付工单'
								},
								{
									id: 225,
									label: '发货提醒工单'
								},
								{
									id: 226,
									label: 'Test'
								}
							]
						},
						{
							id: 23,
							label: 'Test',
							children: [
								{
									id: 234,
									label: '催付工单'
								},
								{
									id: 235,
									label: '发货提醒工单'
								},
								{
									id: 236,
									label: 'Test'
								}
							]
						}
					]
				},
				{
					id: 3,
					label: '售中事务',
					children: [
						{
							id: 4,
							label: '催付工单'
						},
						{
							id: 5,
							label: '发货提醒工单'
						},
						{
							id: 6,
							label: 'Test'
						}
					]
				}
			]
		}];
	});

	angular.module('app').directive('myTree', function() {
		return {
			restrict: 'E',
			templateUrl: './tree.html',
			scope: {
				data: '=',
				onSelected: '&'
			},
			bindToController: true,
			controllerAs: 'vm',
			controller: function() {
				var vm = this;
				vm.scopes = [];
				vm.clearAll = function(selectedItem) {
					vm.scopes.forEach(function(scope) {
						scope.vm.selected = false;
					});
					vm.onSelected && vm.onSelected({item: selectedItem});
				};
			}
		};
	});

	angular.module('app').directive('myTreeItem', function() {
		return {
			restrict: 'E',
			templateUrl: './treeItem.html',
			scope: {
				data: '='
			},
			bindToController: true,
			controllerAs: 'vm',
			replace: true,
			require: '^^myTree',
			controller: function() {

				var vm = this;

				vm.showChildren = true;
				vm.isEdit = false;

				vm.isLeaf = function(treeItem) {
					return !treeItem.children || treeItem.children.length === 0;
				};

				vm.toggleTreeItem = function(bool) {
					vm.showChildren = !bool;
				};
			},
			link: function(scope, element, attrs, vm) {
				vm.scopes.push(scope);
				scope.vm.select = function($event) {
					if ($event.target.classList.contains('treeLabel')) {
						vm.clearAll(scope.vm.data);
						scope.vm.selected = true;
					}
				};
			}
		};
	});

	angular.module('app').directive('myTreeLabelEdit', function($timeout) {
		return {
			restrict: 'E',
			templateUrl: './treeLabelEdit.html',
			scope: {
				data: '=',
				onSelected: '&'
			},
			bindToController: true,
			controllerAs: 'vm',
			replace: true,
			controller: function() {

				var vm = this;

				vm.newLabel = vm.data.label;

				vm.isEdit = false;

				// Bind Different Events to Click and Double Click
				// https://css-tricks.com/snippets/javascript/bind-different-events-to-click-and-double-click/

				var timer = 0;
				var delay = 200;
				var prevent = false;

				vm.select = function($event) {
					timer = $timeout(function() {
						if (!prevent) {
							vm.onSelected && vm.onSelected({$event: $event});
						}
						prevent = false;
					}, delay);
					$event.stopPropagation();
				};

				vm.enableEdit = function($event) {
					$timeout.cancel(timer);
					prevent = true;
					vm.isEdit = true;
					$event.stopPropagation();
				};

				vm.save = function(value, $event) {
					if (vm.data.label !== value) {
						vm.data.label = value;
					}
					vm.isEdit = false;
					$event.stopPropagation();
				};

				vm.cancel = function($event) {
					vm.isEdit = false;
					$event.stopPropagation();
				};
			}
		};
	});
}());
