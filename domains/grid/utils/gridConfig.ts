// All this is just temporal until we implement LSP27TheGrid
// This is a simple way to store the grid configuration in a BaaS database

import Parse from 'parse'

const CLASS_NAME = 'grid_config_new'

Parse.initialize(
  'Y2qPj69JQtmOzHpr49mwNxna9ss2QPsuZV5YH9JH',
  'gQZwrQ25HQ2y1NZFi2JJy0QdLs7hHzMsEpgL9D5J'
)
Parse.serverURL = 'https://parseapi.back4app.com/'

export type GetGridConfigResponse = {
  objectId: string
  config: GridWidget[]
}

export type UpsertGridConfigResponse = {
  objectId: string
  createdAt?: string
  updatedAt?: string
}

export const getGridConfig = async (
  username: string
): Promise<GetGridConfigResponse | undefined> => {
  const query: Parse.Query = new Parse.Query(CLASS_NAME)
  query.equalTo('username', username.toLowerCase())

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
    console.error(`Error while fetching ${CLASS_NAME}`, error)
  }
}

export const upsertGridConfig = async (
  username: string,
  config: LSP27TheGrid
): Promise<UpsertGridConfigResponse | undefined> => {
  const query: Parse.Query = new Parse.Query(CLASS_NAME)
  query.equalTo('username', username.toLowerCase())

  try {
    let object = await query.first()

    if (!object) {
      object = new Parse.Object(CLASS_NAME)
    }

    object.set('config', config)
    object.set('username', username.toLowerCase())

    try {
      const response = await object.save()

      return {
        objectId: response.id,
        createdAt: response.get('createdAt'),
        updatedAt: response.get('updatedAt'),
      }
    } catch (error: any) {
      console.error(`Error while updating ${CLASS_NAME}`, error)
    }
  } catch (error: any) {
    console.error(`Error while retrieving object ${CLASS_NAME}`, error)
  }
}