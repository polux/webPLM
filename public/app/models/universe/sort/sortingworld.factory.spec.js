(function () {
	'use strict';

    describe('SortingWorld', function() {
        var _SortingWorld;
        
        var sortingWorld;
		var type;
		var operations;
		var currentState;
        var readCount;
        var writeCount;
        var values;
        var colors;
        
        beforeEach(module('PLMApp'));
        
        beforeEach(inject(function (SortingWorld) {
			_SortingWorld = SortingWorld;	
		}));
        
        beforeEach(function () {
            var i;
            var nbValue;
            var dataSortingWorld;
            
            type = getRandomString(15);
            operations = [];
            currentState = -1;
            readCount = getRandomInt(100);
            writeCount = getRandomInt(100);
            colors = ['#0000FF', '#FF0000', '#FFFF00',
			'#00FF00', '#00FFFF', '#FF00FF','#663300', '#336699', '#993366', '#666699' ];
            
            values = [];
            nbValue = getRandomInt(100) + 2;
            for(i = 0; i < nbValue; i++) {
                values.push(getRandomInt(100));
            }
            
            dataSortingWorld = {
                type: type,
                readCount: readCount,
                writeCount: writeCount,
                values: values
            };
            sortingWorld = new _SortingWorld(dataSortingWorld);
        });
        
        it('should be initialized correctly by its constructor', function () {
            expect(sortingWorld.type).toEqual(type);
            expect(sortingWorld.operations).toEqual(operations);
            expect(sortingWorld.currentState).toEqual(currentState);
            expect(sortingWorld.readCount).toEqual(readCount);
            expect(sortingWorld.writeCount).toEqual(writeCount);
            for(var i=0; i<this.nbValue; i++) {
				expect(sortingWorld.values[i]).toEqual(values[i]);
                expect(sortingWorld.initValues[i]).toEqual(values[i]);
                expect(sortingWorld.memory[0][i]).toEqual(values[i]);
			}
            expect(sortingWorld.colors).toEqual(colors);
        });
        
        it('clone should return a correct copy of the world', function () {
            var clone = sortingWorld.clone();
            
            expect(sortingWorld.type).toEqual(clone.type);
            expect(sortingWorld.operations).toEqual(clone.operations);
            expect(sortingWorld.currentState).toEqual(clone.currentState);
            expect(sortingWorld.readCount).toEqual(clone.readCount);
            expect(sortingWorld.writeCount).toEqual(clone.writeCount);
            for(var i=0; i<this.nbValue; i++) {
				expect(sortingWorld.values[i]).toEqual(clone.values[i]);
                expect(sortingWorld.initValues[i]).toEqual(clone.initValues[i]);
                expect(sortingWorld.memory[0][i]).toEqual(clone.memory[0][i]);
			}
            expect(sortingWorld.colors).toEqual(clone.colors);
        });
        
        it('addOperations should try to generate an operation for each element of the list', function () {
			var i;
			var elt;
			var nbElt = getRandomInt(50) + 1;
			var operations = [];
			var generatedOperationCallCount;

			spyOn(sortingWorld, 'generatedOperation');
			for(i=0; i<nbElt; i++) {
				elt = getRandomString(3);
				operations.push(elt);
			}
			sortingWorld.addOperations(operations);
			generatedOperationCallCount = sortingWorld.generatedOperation.calls.count();
			expect(generatedOperationCallCount).toEqual(nbElt);
			for(i=0; i<nbElt; i++) {
				elt = sortingWorld.generatedOperation.calls.argsFor(i)[0];
				expect(elt).toEqual(operations[i]);
			}
		});
        
        it('setState should call "apply" for each operations between ' +
			'currentState and objectiveState if objectiveState > currentState', function () {
			var nbSteps = getRandomInt(15)+1;
			var nbOperations;
			var i, j;

			var expectedApplyCallCount = 0;

			var operation = { 
				apply: function () {},
				reverse: function () {} 
			};
			spyOn(operation, 'apply');

			var operations = [];
			var step;

			// Set operations
			for(i=0; i<nbSteps; i++) {
				nbOperations = getRandomInt(15) + 1;
				step = [];
				for(j=0; j<nbOperations; j++) {
					step.push(operation);
				}
				operations.push(step);
			}
			sortingWorld.operations = operations;

			var currentState = getRandomInt(nbSteps) - 1;
			sortingWorld.currentState = currentState;
			var objectiveState = currentState + getRandomInt(nbSteps-currentState-1) + 1;

			for(i=currentState+1; i<=objectiveState; i++) {
				for(j=0; j<operations[i].length; j++) {
					expectedApplyCallCount++;
				}
			}

			sortingWorld.setState(objectiveState);

			var actualApplyCallCount = operation.apply.calls.count();
			expect(actualApplyCallCount).toEqual(expectedApplyCallCount);
		});
        
        it('setState should never call "reverse" if objectiveState > currentState', function () {
			var nbSteps = getRandomInt(15)+1;
			var nbOperations;
			var i, j;

			var expectedReverseCall = false;

			var operation = { 
				apply: function () {},
				reverse: function () {} 
			};
			spyOn(operation, 'reverse');

			var operations = [];
			var step;

			// Set operations
			for(i=0; i<nbSteps; i++) {
				nbOperations = getRandomInt(15) + 1;
				step = [];
				for(j=0; j<nbOperations; j++) {
					step.push(operation);
				}
				operations.push(step);
			}
			sortingWorld.operations = operations;

			// Generate currentState & objectiveState
			var currentState = getRandomInt(nbSteps) - 1;
			sortingWorld.currentState = currentState;
			var objectiveState = currentState + getRandomInt(nbSteps-currentState-1) + 1;

			// Launch setState
			sortingWorld.setState(objectiveState);

			// Check the call count
			var actualReverseCall = operation.reverse.calls.any();
			expect(actualReverseCall).toEqual(expectedReverseCall);
		});

		it('setState should call "reverse" for each operations between ' +
			'currentState and objectiveState if objectiveState > currentState', function () {
			var nbSteps = getRandomInt(15)+1;
			var nbOperations;
			var i, j;

			var expectedReverseCallCount = 0;

			var operation = { 
				apply: function () {},
				reverse: function () {} 
			};
			spyOn(operation, 'reverse');

			var operations = [];
			var step;

			// Set operations
			for(i=0; i<nbSteps; i++) {
				nbOperations = getRandomInt(15) + 1;
				step = [];
				for(j=0; j<nbOperations; j++) {
					step.push(operation);
				}
				operations.push(step);
			}
			sortingWorld.operations = operations;

			var objectiveState = getRandomInt(nbSteps) - 1;
			var currentState = objectiveState + getRandomInt(nbSteps-objectiveState-1) + 1;
			sortingWorld.currentState = currentState;

			for(i=currentState; i>objectiveState; i--) {
				for(j=0; j<operations[i].length; j++) {
					expectedReverseCallCount++;
				}
			}

			sortingWorld.setState(objectiveState);

			var actualReverseCallCount = operation.reverse.calls.count();
			expect(actualReverseCallCount).toEqual(expectedReverseCallCount);
		});

		it('setState should never call "apply" if objectiveState > currentState', function () {
			var nbSteps = getRandomInt(15)+1;
			var nbOperations;
			var i, j;

			var expectedApplyCall = false;

			var operation = { 
				apply: function () {},
				reverse: function () {} 
			};
			spyOn(operation, 'apply');

			var operations = [];
			var step;

			// Set operations
			for(i=0; i<nbSteps; i++) {
				nbOperations = getRandomInt(15) + 1;
				step = [];
				for(j=0; j<nbOperations; j++) {
					step.push(operation);
				}
				operations.push(step);
			}
			sortingWorld.operations = operations;

			// Generate currentState & objectiveState
			var objectiveState = getRandomInt(nbSteps) - 1;
			var currentState = objectiveState + getRandomInt(nbSteps-objectiveState-1) + 1;
			sortingWorld.currentState = currentState;

			// Launch setState
			sortingWorld.setState(objectiveState);

			// Check the call count
			var actualApplyCall = operation.apply.calls.any();
			expect(actualApplyCall).toEqual(expectedApplyCall);
		});

		it('setState should not call "apply" nor "reverse" if objectiveState === currentState', function () {
			var nbSteps = getRandomInt(15)+1;
			var nbOperations;
			var i, j;

			var expectedApplyCall = false;
			var expectedReverseCall = false;

			var operation = { 
				apply: function () {},
				reverse: function () {} 
			};
			spyOn(operation, 'apply');
			spyOn(operation, 'reverse');

			var operations = [];
			var step;

			// Set operations
			for(i=0; i<nbSteps; i++) {
				nbOperations = getRandomInt(15) + 1;
				step = [];
				for(j=0; j<nbOperations; j++) {
					step.push(operation);
				}
				operations.push(step);
			}
			sortingWorld.operations = operations;

			// Generate currentState & objectiveState
			var currentState = getRandomInt(nbSteps) - 1;
			var objectiveState = currentState;
			sortingWorld.currentState = currentState;

			// Launch setState
			sortingWorld.setState(objectiveState);

			// Check the call count
			var actualApplyCall = operation.apply.calls.any();
			var actualReverseCall = operation.reverse.calls.any();
			expect(actualApplyCall).toEqual(expectedApplyCall);
			expect(actualReverseCall).toEqual(expectedReverseCall);
		});
    });
})();
