import main from '../../src/main'

test('find key in array[test getProp]', () => {
    const _arr = [{ id: 1, name: 'Hitesh' }, { id: 2, name: 'Hitesh Kumar' }];
    const test1 = main.getProp(_arr, '[id=1].name')
    expect(test1).toBe('Hitesh')

    const test2 = main.getProp(_arr, '[id>1].name')
    expect(test2).toBe('Hitesh Kumar')
    const test3 = main.getProp(_arr, '[id>=1].name')
    expect(test3).toBe('Hitesh')

    const test4 = main.getProp(_arr, '[id<2].name')
    expect(test4).toBe('Hitesh')

    const test5 = main.getProp(_arr, '[id<=2].name')
    expect(test5).toBe('Hitesh')

    const test6 = main.getProp(_arr, '[id<>2].name')
    expect(test6).toBe('Hitesh')

   

    const _arr1 = {
        name: 'Hitesh Kumar',
        test1: _arr
    }

    const test7 = main.getProp(_arr1, 'test1.[id=1].name')
    expect(test7).toBe('Hitesh')

    const test8 = main.getProp(_arr1, 'test1.1.name')
    expect(test8).toBe('Hitesh Kumar')

    const test9 = main.getProp(_arr, '[id>2].name')
    expect(test9).toBeUndefined()

    const _arr2 = [ 'Hitesh', { id: 2, name: 'Hitesh Kumar' }];
    const test10 = main.getProp(_arr2, '[id=2].name')
    expect(test10).toBe('Hitesh Kumar')
});

test('Set Value in Object[test setProp]', () => {

    let test_collection1 = {id: 1, name: 'Hitesh', child: [{id: 2, name: 'Hitesh2'}, {id: 3, name: 'Hitesh3'}]}

    main.setProp(test_collection1, 'name', 'Helllo')
    expect(test_collection1.name).toBe('Helllo')

    // If try to Assign a prop value and prop in not exist in collection
    main.setProp(test_collection1, 'test', 'Helllo')
    expect(test_collection1.test).toBe('Helllo')

    // Assign a value in array and array element does'nt exists
    
    main.setProp(test_collection1, '_test.0', 'Helllo')
    expect(test_collection1._test[0]).toBe('Helllo')

    // Assign a Relace object Value
    main.setProp(test_collection1, 'child.0', {test: 'Test1'}, true)
    expect(test_collection1.child[0].test).toBe('Test1')
    expect(test_collection1.child[0].name).toBe(undefined)

    // Assign  a object Value and merging
    main.setProp(test_collection1, 'child.1', {test: 'Test1'})
    expect(test_collection1.child[1].test).toBe('Test1')
    expect(typeof test_collection1.child[1].name).toBe('string')

    // Assign a object into key but key does'nt exists in Object
    main.setProp(test_collection1, 'child2', {test: 'Test1'})
    expect(test_collection1.child2.test).toBe('Test1')

    
    // Preset value not object
    main.setProp(test_collection1, 'name', {test: 'Test1'}, true)
    expect(typeof test_collection1.name).toBe('object')
    expect(test_collection1.name.test).toBe('Test1')

})