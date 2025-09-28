import { allOf, allowAll, auth, between, data, denyAll, equal, greaterThan, indexOn, lessThan, newData, node, not, now, oneOf, param, props, read, root, subtract, validate, value, write, concat, add, multiply, divide, modulus, negate } from '../src/index.ts'
import type { Rules } from '../src/types.ts'

const rules = (): Rules => ({
  rules: node(props({
    app: node(
      props({
        update: node(props({
          version: node(validate(newData.isString())),
          force: node(validate(newData.isBoolean())),
          timestamp: node(validate(newData.isNumber()))
        })),
        maintenance: node(props({
          message: node(validate(newData.isString())),
          enabled: node(validate(newData.isBoolean()))
        })),
        postDelay: node(validate(newData.isNumber()))
      }),
      read(allowAll),
      write(denyAll)
    ),
    bookmarks: node(
      param('$userId', $userId => node(
        param('$pathname', () => node(
          props({
            name: node(validate(
              newData.isString(val => between(val.length, 0, 120))
            )),
            pathname: node(validate(
              newData.isString(val => between(val.length, 0, 1000))
            )),
            created_at: node(validate(
              newData.isNumber(newVal => oneOf(
                not(data.exists()),
                data.isNumber(val => (
                  equal(val, newVal)
                ))
              ))
            ))
          }),
          validate(newData.hasChildren(['name', 'pathname', 'created_at']))
        )),
        read(equal($userId, auth.uid)),
        write(equal($userId, auth.uid)),
        validate(root.child('users/', $userId).exists())
      ))
    ),
    completedNodes: node(
      param('$userId', $userId => node(
        param('$gameId', $gameId => node(
          param('$nodeId', () => node(
            write(equal($userId, auth.uid)),
            validate(
              newData.isNumber(newVal => oneOf(
                not(data.exists()),
                data.isNumber(val => (
                  equal(val, newVal)
                ))
              ))
            )
          )),
          read(allowAll),
          validate(root.child('games/', $gameId).exists())
        )),
        validate(root.child('users/', $userId).exists())
      ))
    ),
    gameUsers: node(
      param('$gameId', $gameId => node(
        param('$userId', $userId => node(
          write(equal($userId, auth.uid)),
          validate(
            newData.isNumber(newVal => oneOf(
              not(data.exists()),
              data.isNumber(val => (
                greaterThan(newVal, val)
              ))
            ))
          )
        )),
        validate(root.child('games/', $gameId).exists()),
        read(allowAll),
        indexOn(value)
      ))
    ),
    notes: node(
      param('$userId', $userId => node(
        props({
          text: node(validate(
            newData.isString(val => lessThan(val.length, 1001))
          )),
          updated_at: node(validate(newData.isNumber()))
        }),
        read(equal($userId, auth.uid)),
        write(equal($userId, auth.uid)),
        validate(allOf(
          root.child('users/', $userId).exists(),
          newData.hasChildren(['text', 'updated_at'])
        ))
      ))
    ),
    preferences: node(
      param('$userId', $userId => node(
        props({
          audio: node(validate(
            root.child('users/', $userId).exists())
          ),
          locale: node(validate(
            newData.isString(val => equal(val.length, 2))
          )),
          quality_id: node(validate(
            newData.isString(val => lessThan(val.length, 10))
          )),
          editor: node(validate(newData.isBoolean())),
          hide_presence: node(validate(newData.isBoolean()))
        }),
        read(equal($userId, auth.uid)),
        write(equal($userId, auth.uid)),
        validate(root.child('users/', $userId).exists())
      ))
    ),
    probeGuides: node(
      param('$userId', $userId => node(
        param('$probe_guide', () => node(
          props({
            name: node(validate(
              newData.isString(val => between(val.length, 0, 50))
            )),
            siteProbeMap: node(
              param('$siteNumber', $siteNumber => node(validate(allOf(
                $siteNumber.matches(/^[12345]\\d{2}$/),
                newData.isNumber()
              ))))
            )
          }),
          validate(newData.hasChildren(['name', 'siteProbeMap']))
        )),
        read(allowAll),
        write(equal($userId, auth.uid)),
        validate(root.child('users/', $userId).exists())
      ))
    ),
    userGames: node(
      param('$userId', $userId => node(
        param('$gameId', $gameId => node(
          props({
            playState: node(
              props({
                current: node(validate(
                  newData.isString(val => allOf(
                    val.matches(/^[a-z-]+$/),
                    lessThan(val.length, 32)
                  ))
                )),
                body: node(validate(
                  newData.isString(val => allOf(
                    lessThan(val.length, 201),
                    not(val.contains('\n'))
                  ))
                )),
                updatedAt: node(validate(newData.isNumber()))
              })
            )
          }),
          write(equal($userId, auth.uid)),
          validate(root.child('games/', $gameId).exists())
        )),
        read(allowAll),
        validate(root.child('users/', $userId).exists())
      ))
    ),
    users: node(
      param('$userId', $userId => node(
        props({
          name: node(validate(
            newData.isString(val => between(val.length, 0, 24))
          )),
          created_at: node(validate(
            newData.isNumber(newVal => oneOf(
              not(data.exists()),
              data.isNumber(val => equal(val, newVal))
            ))
          )),
          avatar_id: node(validate(
            newData.isString(val => allOf(
              val.matches(/^[0-9a-z-]+$/),
              lessThan(val.length, 32)
            ))
          )),
          hue: node(validate(newData.isNumber(val => between(val, -1, 360)))),
          about: node(validate(oneOf(
            not(newData.exists()),
            newData.isString(val => lessThan(val.length, 140))
          ))),
          location: node(validate(oneOf(
            not(newData.exists()),
            newData.isString(val => lessThan(val.length, 32))
          )))
        }),
        write(equal($userId, auth.uid)),
        validate(newData.hasChildren(['name', 'created_at']))
      )),
      read(allowAll)
    ),
    games: node(
      param('$gameId', () => node(
        read(denyAll),
        write(denyAll),
        validate(newData.isBoolean(val => equal(val, true)))
      ))
    ),
    gamePosts: node(
      param('$gameId', $gameId => node(
        param('$postId', $postId => node(
          write(allOf(
            root.child('posts/', $postId, '/userId').isString(val => equal(val, auth.uid)),
            root.child('posts/', $postId, '/gameId').isString(val => equal(val, $gameId))
          )),
          validate(allOf(
            not(data.exists()),
            newData.isNumber(val => equal(val, now))
          ))
        )),
        indexOn(value),
        read(allowAll),
        validate(root.child('games/', $gameId).exists())
      ))
    ),
    userPosts: node(
      param('$userId', $userId => node(
        param('$postId', $postId => node(
          write(allOf(
            equal($userId, auth.uid),
            root.child('posts/', $postId, '/userId').isString(val => equal(val, auth.uid))
          )),
          validate(allOf(
            not(data.exists()),
            newData.isNumber(val => equal(val, now))
          ))
        )),
        indexOn(value),
        read(allowAll),
        validate(root.child('users/', $userId).exists())
      ))
    ),
    gameUserPosts: node(
      param('$gameId', $gameId => node(
        param('$userId', $userId => node(
          param('$postId', $postId => node(
            write(allOf(
              root.child('posts/', $postId, '/userId').isString(val => equal(val, auth.uid)),
              root.child('posts/', $postId, '/gameId').isString(val => equal(val, $gameId))
            )),
            validate(allOf(
              not(data.exists()),
              newData.isNumber(val => equal(val, now))
            ))
          )),
          indexOn(value),
          read(allowAll),
          validate(root.child('users/', $userId).exists())
        )),
        validate(root.child('games/', $gameId).exists())
      ))
    ),
    postReplies: node(
      param('$postId', $postId => node(
        param('$replyId', $replyId => node(
          write(allOf(
            root.child('posts/', $replyId, '/userId').isString(val => equal(val, auth.uid)),
            root.child('posts/', $replyId, '/parentId').isString(val => equal(val, $postId))
          )),
          validate(allOf(
            not(data.exists()),
            newData.isNumber(val => equal(val, now))
          ))
        )),
        indexOn(value),
        read(allowAll),
        validate(root.child('posts/', $postId).exists())
      ))
    ),
    posts: node(
      param('$postId', $postId => node(
        props({
          createdAt: node(validate(oneOf(
            allOf(data.exists(), newData.isNumber(newVal => data.isNumber(val => equal(newVal, val)))),
            allOf(not(data.exists()), newData.isNumber(val => equal(val, now)))
          ))),
          updatedAt: node(validate(newData.isNumber(val => equal(val, now)))),
          userId: node(validate(oneOf(
            allOf(data.exists(), newData.isString(newVal => data.isString(val => equal(newVal, val)))),
            allOf(not(data.exists()), newData.isString(val => root.child('users/', val).exists()))
          ))),
          gameId: node(validate(oneOf(
            allOf(data.exists(), newData.isString(newVal => data.isString(val => equal(newVal, val)))),
            allOf(not(data.exists()), newData.isString(val => root.child('games/', val).exists()))
          ))),
          parentId: node(validate(oneOf(
            allOf(root.child('posts/', $postId).exists(), newData.isString(newVal => data.isString(val => equal(newVal, val)))),
            allOf(
              not(root.child('posts/', $postId).exists()),
              oneOf(
                not(newData.exists()),
                newData.isString(val => root.child('posts/', val).exists())
              )
            )
          ))),
          body: node(validate(
            newData.isString(val => between(val.length, 0, 1024))
          ))
        }),
        read(allowAll),
        write(allOf(
          newData.child('userId').isString(val => equal(val, auth.uid)),
          root.child('postRequests/', auth.uid, '/postId').isString(val => equal(val, $postId))
        )),
        validate(allOf(
          not(data.exists()),
          newData.hasChildren(['createdAt', 'updatedAt', 'userId', 'gameId', 'body'])
        ))
      ))
    ),
    postRequests: node(
      param('$userId', $userId => node(
        props({
          createdAt: node(validate(newData.isNumber(val => equal(val, now)))),
          postId: node(validate(not(newData.isString(val => root.child('posts/', val).exists()))))
        }),
        read(equal($userId, auth.uid)),
        write(equal($userId, auth.uid)),
        validate(allOf(
          newData.hasChildren(['createdAt']),
          oneOf(
            not(data.exists()),
            data.child('createdAt').isNumber(createdAt => (
              root.child('app/postDelay').isNumber(postDelay => (
                lessThan(createdAt, subtract(now, postDelay))
              ))
            ))
          )
        ))
      ))
    ),
    authTest: node(
      props({
        uid: node(validate(newData.isString(newVal => equal(newVal, auth.uid)))),
        provider: node(validate(newData.isString(newVal => equal(newVal, auth.provider))))
      })
    ),
    authTokenTest: node(
      props({
        email: node(validate(newData.isString(newVal => equal(newVal, auth.token.email)))),
        email_verified: node(validate(newData.isBoolean(newVal => equal(newVal, auth.token.email_verified)))),
        phone_number: node(validate(newData.isString(newVal => equal(newVal, auth.token.phone_number)))),
        name: node(validate(newData.isString(newVal => equal(newVal, auth.token.name)))),
        sub: node(validate(newData.isString(newVal => equal(newVal, auth.token.sub)))),
        iss: node(validate(newData.isString(newVal => equal(newVal, auth.token.iss)))),
        aud: node(validate(newData.isString(newVal => equal(newVal, auth.token.aud)))),
        auth_time: node(validate(newData.isNumber(newVal => equal(newVal, auth.token.auth_time)))),
        iat: node(validate(newData.isNumber(newVal => equal(newVal, auth.token.iat)))),
        exp: node(validate(newData.isNumber(newVal => equal(newVal, auth.token.exp))))
      })
    ),
    authTokenFirebaseTest: node(
      props({
        sign_in_provider: node(validate(newData.isString(newVal => equal(newVal, auth.token.firebase.sign_in_provider))))
      })
    ),
    authTokenFirebaseIdentitiesTest: node(
      props({
        email: node(validate(newData.isString(newVal => equal(newVal, auth.token.firebase.identities.email[0])))),
        phone: node(validate(newData.isString(newVal => equal(newVal, auth.token.firebase.identities.phone[1])))),
        'google_com': node(validate(newData.isString(newVal => equal(newVal, auth.token.firebase.identities['google.com'][2])))),
        'facebook_com': node(validate(newData.isString(newVal => equal(newVal, auth.token.firebase.identities['facebook.com'][3])))),
        'github_com': node(validate(newData.isString(newVal => equal(newVal, auth.token.firebase.identities['github.com'][4])))),
        'twitter_com': node(validate(newData.isString(newVal => equal(newVal, auth.token.firebase.identities['twitter.com'][5]))))
      })
    ),
    stringTest: node(
      props({
        contains: node(
          param('$id', $id => node(
            props({
              param: node(validate(newData.isString(val => val.contains($id)))),
              concat: node(validate(newData.isString(val => val.contains(concat('h=', $id)))))
            })
          ))
        )
      })
    ),
    operatorTest: node(
      props({
        add: node(validate(newData.isNumber(newVal => add(newVal, 1, 2, 3)))),
        subtract: node(validate(newData.isNumber(newVal => subtract(newVal, 1, 2, 3)))),
        multiply: node(validate(newData.isNumber(newVal => multiply(newVal, 1, 2, 3)))),
        divide: node(validate(newData.isNumber(newVal => divide(newVal, 1, 2, 3)))),
        modulus: node(validate(newData.isNumber(newVal => modulus(newVal, 1, 2, 3)))),
        negate: node(validate(newData.isNumber(newVal => negate(newVal)))),
        concat: node(validate(newData.isString(newVal => concat(newVal, 'one', 'two', 'three'))))
      })
    ),
  }))
})

export { rules }
