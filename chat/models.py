from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class TimeStamped(models.Model):
    class Meta:
        abstract = True

    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs) -> None:
        _now = timezone.now()
        self.updated = _now
        if not self.id:
            self.created = _now
        return super(TimeStamped, self).save(*args, **kwargs)


class Group(TimeStamped):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(
        User, related_name="chat_groups", through="GroupMembership"
    )

    def __str__(self) -> str:
        return self.name


class Message(TimeStamped):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True, null=True)
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="received_messages",
    )
    content = models.TextField()
    likes = models.ManyToManyField(User, related_name="messages", through="MessageLike")

    def __str__(self) -> str:
        message_len = len(self.content)
        if message_len > 10:
            return self.content[:10] + "..."
        return self.content


class GroupMembership(TimeStamped):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)

    def __str__(self) -> str:
        return (" -> ").join([self.user.first_name, self.group.name])


class MessageLike(TimeStamped):
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_liked = models.BooleanField(default=True)
