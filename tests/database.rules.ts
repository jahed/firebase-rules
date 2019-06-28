import { allOf, allowAll, auth, between, data, denyAll, equal, greaterThan, indexOn, lessThan, newData, node, not, now, oneOf, param, props, read, root, subtract, validate, value, write } from '../src'
import { Rules } from '../src/types'

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
      write(equal(auth.uid, 'frontiernav-server'))
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
              allOf(newData.isNumber(), oneOf(
                not(data.exists()), equal(data.val(), newData.val()))
              )
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
              allOf(
                newData.isNumber(),
                oneOf(not(data.exists()), equal(data.val(), newData.val()))
              )
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
          validate(allOf(
            newData.isNumber(),
            oneOf(not(data.exists()), greaterThan(newData.val(), data.val()))
          ))
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
          created_at: node(validate(allOf(
            newData.isNumber(),
            oneOf(
              not(data.exists()),
              equal(data.val(), newData.val())
            )
          ))),
          avatar_id: node(validate(
            newData.isString(val => allOf(
              val.matches(/^[0-9a-z-]+$/),
              lessThan(val.length, 32)
            ))
          )),
          hue: node(validate(allOf(
            newData.isNumber(),
            between(newData.val(), -1, 360)
          ))),
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
        validate(equal(newData.val(), true))
      ))
    ),
    gamePosts: node(
      param('$gameId', $gameId => node(
        param('$postId', $postId => node(
          write(allOf(
            equal(root.child('posts/', $postId, '/userId').val(), auth.uid),
            equal(root.child('posts/', $postId, '/gameId').val(), $gameId)
          )),
          validate(allOf(not(data.exists()), equal(newData.val(), now)))
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
            equal(root.child('posts/', $postId, '/userId').val(), auth.uid)
          )),
          validate(allOf(not(data.exists()), equal(newData.val(), now)))
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
              equal(root.child('posts/', $postId, '/userId').val(), auth.uid),
              equal(root.child('posts/', $postId, '/gameId').val(), $gameId)
            )),
            validate(allOf(not(data.exists()), equal(newData.val(), now)))
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
            equal(root.child('posts/', $replyId, '/userId').val(), auth.uid),
            equal(root.child('posts/', $replyId, '/parentId').val(), $postId)
          )),
          validate(allOf(not(data.exists()), equal(newData.val(), now)))
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
            allOf(data.exists(), equal(newData.val(), data.val())),
            allOf(not(data.exists()), equal(newData.val(), now))
          ))),
          updatedAt: node(validate(equal(newData.val(), now))),
          userId: node(validate(oneOf(
            allOf(data.exists(), equal(newData.val(), data.val())),
            allOf(not(data.exists()), root.child('users/', newData.val()).exists())
          ))),
          gameId: node(validate(oneOf(
            allOf(data.exists(), equal(newData.val(), data.val())),
            allOf(not(data.exists()), root.child('games/', newData.val()).exists())
          ))),
          parentId: node(validate(oneOf(
            allOf(root.child('posts/', $postId).exists(), equal(newData.val(), data.val())),
            allOf(
              not(root.child('posts/', $postId).exists()),
              oneOf(not(newData.exists()), root.child('posts/', newData.val()).exists())
            )
          ))),
          body: node(validate(
            newData.isString(val => between(val.length, 0, 1024))
          ))
        }),
        read(allowAll),
        write(allOf(
          equal(newData.child('userId').val(), auth.uid),
          equal(root.child('postRequests/', auth.uid, '/postId').val(), $postId)
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
          createdAt: node(validate(equal(newData.val(), now))),
          postId: node(validate(not(root.child('posts/', newData.val()).exists())))
        }),
        read(equal($userId, auth.uid)),
        write(equal($userId, auth.uid)),
        validate(allOf(
          newData.hasChildren(['createdAt']),
          oneOf(
            not(data.exists()),
            lessThan(
              data.child('createdAt').val(),
              subtract(now, root.child('app/postDelay').val())
            )
          )
        ))
      ))
    )
  }))
})

export { rules };

