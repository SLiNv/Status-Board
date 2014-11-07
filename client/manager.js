if (Meteor.isClient) {

  Template.manage.events({
    'click #showCommits': function() {
      $('#m_commits').addClass('hidden');
      $('#m_announcements').addClass('hidden');
      $('#m_repos').addClass('hidden');
      $('#m_mentors').addClass('hidden');
      $('#m_users').addClass('hidden');
      $('#m_commits').toggleClass("hidden");
    },
    'click #showAnnouncements': function() {
      $('#m_commits').addClass('hidden');
      $('#m_announcements').addClass('hidden');
      $('#m_repos').addClass('hidden');
      $('#m_mentors').addClass('hidden');
      $('#m_users').addClass('hidden');
      $('#m_announcements').toggleClass("hidden");
    },
    'click #showRepos': function() {
      $('#m_commits').addClass('hidden');
      $('#m_announcements').addClass('hidden');
      $('#m_repos').addClass('hidden');
      $('#m_mentors').addClass('hidden');
      $('#m_users').addClass('hidden');
      $('#m_repos').toggleClass("hidden");
    },
    'click #showMentors': function() {
      $('#m_commits').addClass('hidden');
      $('#m_announcements').addClass('hidden');
      $('#m_repos').addClass('hidden');
      $('#m_mentors').addClass('hidden');
      $('#m_users').addClass('hidden');
      $('#m_mentors').toggleClass("hidden");
    },
    'click #showUsers': function() {
      $('#m_commits').addClass('hidden');
      $('#m_announcements').addClass('hidden');
      $('#m_repos').addClass('hidden');
      $('#m_mentors').addClass('hidden');
      $('#m_users').addClass('hidden');
      $('#m_users').toggleClass("hidden");
    }
  });


  Template.announcements.helpers({
    activeAnnouncements: function() {
      Meteor.subscribe("Announcements");
      return Announcements.find();
    }
  });


  Template.announcements.events({
    'click #addAnnouncementBtn': function() {
      var header = $('#inputHeader').val();
      var body = $('#inputBody').val();
      var startNow = $('input[name="announcementStart"]:checked').length > 0;
      var startTime = $('#inputStartTime').val();
      var duration = $('#inputDuration').val();
      var visible = false;

      if (startNow) {
        startTime = new Date(); // now
        visible = true;
      }
      else {
        startTime = new Date(startTime+":00");
        startTime = new Date(startTime.getTime() + 5*60*60000); // timezone offset
      }

      var endTime = new Date(startTime.getTime() + duration*60000);

      Announcements.insert({
        header: header,
        text: body,
        startTime: startTime,
        endTime: endTime,
        visible: visible
      });

      $("#announcementAlertBox").empty();
      $("<div>", {
        "class": "alert alert-success alert-dismissible",
        text: "Announcements Added"
      }).append('<button type="button" \
        class="close" data-dismiss="alert" \
        aria-hidden="true">&times;</button>').appendTo("#announcementAlertBox");
    },

    'click .removeAnnouncement': function() {
      Meteor.subscribe("Announcements");
      if (confirm("Remove this announcement?")) {
        Announcements.remove({ _id:this._id })
      }
    }

  });


  Template.m_mentors.rendered = function() {
    $('#inputMentorTags').tokenfield({
      autocomplete: {
        source: ['red','blue','green','yellow','violet','brown','purple','black','white'],
        delay: 100
      },
      showAutocompleteOnFocus: true
    });
  };

  Template.m_mentors.helpers({
    all_mentors: function() {
      Meteor.subscribe("Mentors");
      return Mentors.find();
    },
    mentor_queue: function() {
      Meteor.subscribe("MentorQueue");
      return MentorQueue.find();
    }
  });

  Template.m_mentors.events({
    'click #addMentor': function() {
      var name = $("#inputMentorName").val();
      var phone = $("#inputMentorPhone").val();
      var tags = $("#inputMentorTags").val().split(",");

      Mentors.insert({
        name: name,
        phone: phone,
        tags: tags,
        available: true,
        suspended: false,
      });

    },

    'click .removeMentor': function() {
      Meteor.subscribe("Mentors");
      if (confirm("Remove this mentor?"))
        Mentors.remove({ _id:this._id });
    },

    'click .suspendMentor': function() {
      Meteor.subscribe("Mentors");
      var state = Mentors.find({ _id:this._id }).fetch()[0].suspended;
      if (!state) {
        if (confirm("Suspend this mentor?"))
          Mentors.update({ _id:this._id}, {
            $set: {suspended: true}
          });
      }
      else {
        if (confirm("Activate this mentor?"))
          Mentors.update({ _id:this._id }, {
            $set: {suspended: false}
          });
      }
    },

    'click .editMentor': function() {
      // implement this later
      return;
    },

    'click .clearMentor': function() {
      Meteor.subscribe("Mentors");
      if (confirm("Clear all states on this mentor?"))
        Mentors.update({ _id:this._id }, {
          $set: {available:true, suspended:false}
        });
    },

    'click .removeMentorRequest': function() {
      Meteor.subscribe("MentorQueue");
      if (confirm("Remove this mentor request?"))
        MentorQueue.remove({ _id:this._id });
    }
  });


}
