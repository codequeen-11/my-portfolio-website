from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.db.models import QuerySet
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.generic import DetailView, RedirectView, UpdateView
from django.shortcuts import render

from natia.users.models import User


class UserDetailView(LoginRequiredMixin, DetailView):
    model = User
    slug_field = "id"
    slug_url_kwarg = "id"


user_detail_view = UserDetailView.as_view()


class UserUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = User
    fields = ["name"]
    success_message = _("Information successfully updated")

    def get_success_url(self) -> str:
        assert self.request.user.is_authenticated  # type guard
        return self.request.user.get_absolute_url()

    def get_object(self, queryset: QuerySet | None = None) -> User:
        assert self.request.user.is_authenticated  # type guard
        return self.request.user


user_update_view = UserUpdateView.as_view()


class UserRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self) -> str:
        return reverse("users:detail", kwargs={"pk": self.request.user.pk})


user_redirect_view = UserRedirectView.as_view()


# ✅ THIS SHOULD BE OUTSIDE THE CLASSES
def root_page_view(request):
    skills = [
        ['HTML', '98%', '6.png'],
        ['CSS', '95%', 'css.png'],
        ['Bootstrap', '95%', 'bootstrap.png'],
        ['MySQL', '96%', 'Mysql.png'],
        ['JavaScript', '85%', '5.png'],
        ['React JS', '79%', '9.png'],
        ['Git', '85%', 'git.png'],
        ['Node.js', '87%', 'node.png'],
    ]
    return render(request, 'sections/about.html', {'skills': skills})
