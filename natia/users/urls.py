# from django.urls import path

# from .views import user_detail_view
# from .views import user_redirect_view
# from .views import user_update_view

# i added
# from .views import root_page_view

# urlpatterns = [
#     path("", root_page_view, name="home"),
# ]

# app_name = "users"
# urlpatterns = [
#     path("~redirect/", view=user_redirect_view, name="redirect"),
#     path("~update/", view=user_update_view, name="update"),
#     path("<int:pk>/", view=user_detail_view, name="detail"),
# ]

# updated
# from django.urls import path

# from .views import (
#     user_detail_view,
#     user_redirect_view,
#     user_update_view,
#     root_page_view,  # added view
# )

# app_name = "users"

# urlpatterns = [
#     path("", root_page_view, name="home"),
#     path("~redirect/", view=user_redirect_view, name="redirect"),
#     path("~update/", view=user_update_view, name="update"),
#     path("<int:pk>/", view=user_detail_view, name="detail"),
# ]
from django.urls import path

from .views import (
    user_detail_view,
    user_redirect_view,
    user_update_view,
    root_page_view,
)

app_name = "users"

urlpatterns = [
    path("", root_page_view, name="home"),
    path("~redirect/", user_redirect_view, name="redirect"),
    path("~update/", user_update_view, name="update"),
    path("<int:id>/", user_detail_view, name="detail"),  # use 'id' to match slug_url_kwarg in view
]
