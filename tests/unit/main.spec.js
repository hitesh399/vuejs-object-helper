import main from '../../src/main'

test('find key from array', () => {
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