// All this is just temporal until we implement LSP22TheGrid
// This is a simple way to store the grid configuration in a BaaS database

import Parse from 'parse'

import type { Widget } from '../types/grid'

Parse.initialize(
  'Y2qPj69JQtmOzHpr49mwNxna9ss2QPsuZV5YH9JH',
  'gQZwrQ25HQ2y1NZFi2JJy0QdLs7hHzMsEpgL9D5J'
)
Parse.serverURL = 'https://parseapi.back4app.com/'

export type GetGridConfigResponse = {
  objectId: string
  config: Widget[]
}

export type UpsertGridConfigResponse = {
  objectId: string
  createdAt?: string
  updatedAt?: string
}

export async function getGridConfig(
  username: string
): Promise<GetGridConfigResponse | undefined> {
  const query: Parse.Query = new Parse.Query('grid_config')
  query.equalTo('username', username)

  try {
    const object = await query.first()

    if (!object) {
      return
    }

    return {
      objectId: object.id,
      config: object?.get('config'),
    }
  } catch (error: any) {
    console.error('Error while fetching grid_config', error)
  }
}

export async function upsertGridConfig(
  username: string,
  config: Widget[]
): Promise<UpsertGridConfigResponse | undefined> {
  const query: Parse.Query = new Parse.Query('grid_config')
  query.equalTo('username', username)

  try {
    let object = await query.first()

    if (!object) {
      object = new Parse.Object('grid_config')
    }

    object.set('config', config)
    object.set('username', username)

    try {
      const response = await object.save()

      return {
        objectId: response.id,
        createdAt: response.get('createdAt'),
        updatedAt: response.get('updatedAt'),
      }
    } catch (error: any) {
      console.error('Error while updating grid_config', error)
    }
  } catch (error: any) {
    console.error('Error while retrieving object grid_config', error)
  }
}