var Hashids  = require('hashids');
var hashids  = new Hashids(12345678, 12);

exports.seed = function(knex, Promise) {
  return Promise.join(

    knex('Users').del(),
    knex('Entities').del(),
    knex('EntityOwner').del(),

    knex('Users').insert({
      id: 1,
      username: 'jack',
      email : 'jack@test.com',
      'encrypted_password' : '$2a$10$C/CHyuMOxT4i/byo6haLcu06duVduNWHtMvWfMQUP/1OHKDPW/nS6', // 12345678
      deleted : false,
      'entity_id' : 1,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Person entity for user.id 1
    knex('Entities').insert({
      id : 1,
      'type' : 'person',
      'name' : 'Jack',
      'lastname' : 'Johnson',
      'profile_name' : 'jack_johnson',
      'is_anonymous' : false,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Shadow entity for user.id 1
    knex('Entities').insert({
      id : 2,
      'type' : 'person',
      'name' : 'Anonymous',
      'lastname' : '',
      'profile_name' : 'anonymous_' + hashids.encode(1),
      'is_anonymous' : true,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    knex('EntityOwner').insert({
      id : 1,
      'owner_id' : 1,
      'owned_id' : 2,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),


    knex('Users').insert({
      id: 2,
      username: 'john',
      email : 'john@test.com',
      'encrypted_password' : '$2a$10$C/CHyuMOxT4i/byo6haLcu06duVduNWHtMvWfMQUP/1OHKDPW/nS6', // 12345678
      deleted : false,
      'entity_id' : 3,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Person entity for user.id 2
    knex('Entities').insert({
      id : 3,
      'type' : 'person',
      'name' : 'John',
      'lastname' : 'Jackson',
      'profile_name' : 'john_jackson',
      'is_anonymous' : false,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Shadow entity for user.id 1
    knex('Entities').insert({
      id : 4,
      'type' : 'person',
      'name' : 'Anonymous',
      'lastname' : '',
      'profile_name' : 'anonymous_' + hashids.encode(2),
      'is_anonymous' : true,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    knex('EntityOwner').insert({
      id : 2,
      'owner_id' : 3,
      'owned_id' : 4,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),


    // User 3
    knex('Users').insert({
      id: 3,
      username: 'peter',
      email : 'peter@test.com',
      'encrypted_password' : '$2a$10$C/CHyuMOxT4i/byo6haLcu06duVduNWHtMvWfMQUP/1OHKDPW/nS6', // 12345678
      deleted : false,
      'entity_id' : 5,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Person entity for user.id 2
    knex('Entities').insert({
      id : 5,
      'type' : 'person',
      'name' : 'Peter',
      'lastname' : 'Jackson',
      'profile_name' : 'peter_jackson',
      'is_anonymous' : false,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Shadow entity for user.id 1
    knex('Entities').insert({
      id : 6,
      'type' : 'person',
      'name' : 'Anonymous',
      'lastname' : '',
      'profile_name' : 'anonymous_' + hashids.encode(3),
      'is_anonymous' : true,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    knex('EntityOwner').insert({
      id : 3,
      'owner_id' : 5,
      'owned_id' : 6,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // User 4
    knex('Users').insert({
      id: 4,
      username: 'steve',
      email : 'steve@test.com',
      'encrypted_password' : '$2a$10$C/CHyuMOxT4i/byo6haLcu06duVduNWHtMvWfMQUP/1OHKDPW/nS6', // 12345678
      deleted : false,
      'entity_id' : 7,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Person entity for user.id 2
    knex('Entities').insert({
      id : 7,
      'type' : 'person',
      'name' : 'Steve',
      'lastname' : 'Stevenson',
      'profile_name' : 'steve_stevenson',
      'is_anonymous' : false,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Shadow entity for user.id 1
    knex('Entities').insert({
      id : 8,
      'type' : 'person',
      'name' : 'Anonymous',
      'lastname' : '',
      'profile_name' : 'anonymous_' + hashids.encode(4),
      'is_anonymous' : true,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    knex('EntityOwner').insert({
      id : 4,
      'owner_id' : 7,
      'owned_id' : 8,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Message Threads
    //
    // Between Jack and John
    //
    knex('MessageThreads').insert({
      'id' : 1,
      'sender_person_id'       : 1,
      'sender_entity_id'       : 1,
      'receiver_entity_id'     : 3,
      'hidden_for_sender'      : false,
      'hidden_for_receiver'    : false,
      'last_seen_sender'       : null,
      'last_seen_receiver'     : null,
      'message_count_sender'   : 0,
      'message_count_receiver' : 0,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Messages of thread 1
    //
    // Between Jack and John

    // Jack
    knex('Messages').insert({
      'id'                    : 1,
      'type'                  : 'message',
      'sender_person_id'      : 1,
      'sender_entity_id'      : 1,
      'receiver_entity_id'    : 3,
      'thread_id'             : 1,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : 'Que pedo John, como estas?',
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // John
    knex('Messages').insert({
      'id'                    : 2,
      'type'                  : 'message',
      'sender_person_id'      : 3,
      'sender_entity_id'      : 3,
      'receiver_entity_id'    : 1,
      'thread_id'             : 1,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : 'Que pedo Jack, bien y tu?',
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // Jack
    knex('Messages').insert({
      'id'                    : 3,
      'type'                  : 'message',
      'sender_person_id'      : 1,
      'sender_entity_id'      : 1,
      'receiver_entity_id'    : 3,
      'thread_id'             : 1,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : 'Pues aqui haciendo un sistema de mensajes, como esta todo por alla?',
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // John
    knex('Messages').insert({
      'id'                    : 4,
      'type'                  : 'message',
      'sender_person_id'      : 3,
      'sender_entity_id'      : 3,
      'receiver_entity_id'    : 1,
      'thread_id'             : 1,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : 'Ohh y como vas?, aqui todo bien...',
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // Jack
    knex('Messages').insert({
      'id'                    : 5,
      'type'                  : 'message',
      'sender_person_id'      : 1,
      'sender_entity_id'      : 1,
      'receiver_entity_id'    : 3,
      'thread_id'             : 1,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : 'Atrazado 1 semana =/?',
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // Jack
    knex('Messages').insert({
      'id'                    : 6,
      'type'                  : 'message',
      'sender_person_id'      : 1,
      'sender_entity_id'      : 1,
      'receiver_entity_id'    : 3,
      'thread_id'             : 1,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : 'Diseño cambio los mockups y hubo que volver a hacer la arquitectura, pero ahi va quedando.',
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // Message Threads
    //
    // Between Jack and Peter
    //
    knex('MessageThreads').insert({
      'id' : 2,
      'sender_person_id'       : 1,
      'sender_entity_id'       : 1,
      'receiver_entity_id'     : 5,
      'hidden_for_sender'      : false,
      'hidden_for_receiver'    : false,
      'last_seen_sender'       : null,
      'last_seen_receiver'     : null,
      'message_count_sender'   : 0,
      'message_count_receiver' : 0,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Jack
    knex('Messages').insert({
      'id'                    : 7,
      'type'                  : 'message',
      'sender_person_id'      : 1,
      'sender_entity_id'      : 1,
      'receiver_entity_id'    : 5,
      'thread_id'             : 2,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : "Sup Peter, I've heard Brian is dead.",
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // Peter
    knex('Messages').insert({
      'id'                    : 8,
      'type'                  : 'message',
      'sender_person_id'      : 5,
      'sender_entity_id'      : 5,
      'receiver_entity_id'    : 1,
      'thread_id'             : 2,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : "man!!! fucking car accident =/",
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // Peter
    knex('Messages').insert({
      'id'                    : 9,
      'type'                  : 'message',
      'sender_person_id'      : 1,
      'sender_entity_id'      : 1,
      'receiver_entity_id'    : 5,
      'thread_id'             : 2,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : "Poor dog.",
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // Message Threads
    //
    // Between Jack and Steve
    //
    knex('MessageThreads').insert({
      'id' : 3,
      'sender_person_id'       : 1,
      'sender_entity_id'       : 1,
      'receiver_entity_id'     : 7,
      'hidden_for_sender'      : false,
      'hidden_for_receiver'    : false,
      'last_seen_sender'       : null,
      'last_seen_receiver'     : null,
      'message_count_sender'   : 0,
      'message_count_receiver' : 0,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Jack
    knex('Messages').insert({
      'id'                    : 10,
      'type'                  : 'message',
      'sender_person_id'      : 1,
      'sender_entity_id'      : 1,
      'receiver_entity_id'    : 7,
      'thread_id'             : 3,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : "Hey Steve!",
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // Steve
    knex('Messages').insert({
      'id'                    : 11,
      'type'                  : 'message',
      'sender_person_id'      : 7,
      'sender_entity_id'      : 7,
      'receiver_entity_id'    : 1,
      'thread_id'             : 3,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : "Did you hear about Peter's dog?",
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // Steve
    knex('Messages').insert({
      'id'                    : 12,
      'type'                  : 'message',
      'sender_person_id'      : 7,
      'sender_entity_id'      : 7,
      'receiver_entity_id'    : 1,
      'thread_id'             : 3,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : "Jack!!!",
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // Message Threads
    //
    // Between John and Peter
    //
    knex('MessageThreads').insert({
      'id' : 4,
      'sender_person_id'       : 3,
      'sender_entity_id'       : 3,
      'receiver_entity_id'     : 5,
      'hidden_for_sender'      : false,
      'hidden_for_receiver'    : false,
      'last_seen_sender'       : null,
      'last_seen_receiver'     : null,
      'message_count_sender'   : 0,
      'message_count_receiver' : 0,
      'created_at' : new Date(),
      'updated_at' : new Date()
    }),

    // Jack
    knex('Messages').insert({
      'id'                    : 13,
      'type'                  : 'message',
      'sender_person_id'      : 3,
      'sender_entity_id'      : 3,
      'receiver_entity_id'    : 5,
      'thread_id'             : 4,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : "Sorry about your dog man!",
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    }),

    // Steve
    knex('Messages').insert({
      'id'                    : 14,
      'type'                  : 'message',
      'sender_person_id'      : 5,
      'sender_entity_id'      : 5,
      'receiver_entity_id'    : 3,
      'thread_id'             : 4,
      'invitation_request_id' : null,
      'voice_id'              : null,
      'organization_id'       : null,
      'message'               : "Don't worry, Stewie has a time machine and will fix everything :)",
      'hidden_for_sender'     : false,
      'hidden_for_receiver'   : false,
      'created_at'            : new Date(),
      'updated_at'            : new Date()
    })


  );
};
