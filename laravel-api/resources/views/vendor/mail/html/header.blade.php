@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
<img src="{{ asset('images/logo.png') }}" alt="{{ config('app.name') }}" width="64" height="64" style="border-radius: 12px; display: block;" />
</a>
</td>
</tr>
