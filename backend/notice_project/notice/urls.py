from django.urls import path
from .views import CreateNoticeView, CommentReactionAPIView, AllNoticesView, CommentDeleteAPIView, NoticeDeleteAPIView, EditNoticeAPIView, RetrieveNoticeCommentsView, CommentCreateAPIView, UserNoticesView

#add url routes here

urlpatterns = [

    path('notices/', CreateNoticeView.as_view()),

    path('all-notices', AllNoticesView.as_view()),

<<<<<<< HEAD
    path('user-notices/<int:user_id>/', UserNoticesView.as_view()),
=======
    path('user-notices/<int:user_id>', UserNoticesView.as_view()),
>>>>>>> 928c16d4b4745ce334c0ca0b18bc2c7b4439616d

    path('comment/reaction/update', CommentReactionAPIView.as_view()),
    
    path('notice/update', EditNoticeAPIView.as_view()),

    path('comment/delete', CommentDeleteAPIView.as_view()),
    
    path('notice/delete', NoticeDeleteAPIView.as_view()),

    path('comment/get', RetrieveNoticeCommentsView.as_view()),

    path('comment/create', CommentCreateAPIView.as_view()),
        
]

