import { describe, expect, it } from 'vitest'
import { cloneObject } from '../cloneObject'

describe('cloneObject', () => {
  it('should clone a simple object', () => {
    const obj = { a: 1, b: 'test', c: true }
    const clonedObj = cloneObject(obj)
    expect(clonedObj).toEqual(obj)
    expect(clonedObj).not.toBe(obj)
  })

  it('should clone a nested object', () => {
    const obj = { a: 1, b: { c: 2, d: { e: 3 } } }
    const clonedObj = cloneObject(obj)
    expect(clonedObj).toEqual(obj)
    expect(clonedObj.b).not.toBe(obj.b)
    expect(clonedObj.b.d).not.toBe(obj.b.d)
  })

  it('should clone an array', () => {
    const arr = [1, 2, 3, { a: 4 }]
    const clonedArr = cloneObject(arr)
    expect(clonedArr).toEqual(arr)
    expect(clonedArr).not.toBe(arr)
    expect(clonedArr[3]).not.toBe(arr[3])
  })

  it('should not handle special types like Date', () => {
    const obj = { a: new Date() }
    const clonedObj = cloneObject(obj)
    expect(clonedObj.a).not.toBeInstanceOf(Date)
  })

  it('should not handle special types like Map', () => {
    const obj = { a: new Map() }
    const clonedObj = cloneObject(obj)
    expect(clonedObj.a).not.toBeInstanceOf(Map)
  })

  it('should throw an error for circular references', () => {
    const obj: any = { a: 1 }
    obj.b = obj
    expect(() => cloneObject(obj)).toThrow()
  })
})
